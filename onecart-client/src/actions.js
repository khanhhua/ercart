import {
  ACTION_REMOVE_ITEM,
  ACTION_SHOW_SUMMARY,
  ACTION_UPDATE_CART,
  ACTION_SHOW_CART,
  ACTION_INIT_CART,
  ACTION_HIDE_CART,
  ACTION_CHECKOUT,
  ACTION_PLACE_ORDER,
  ACTION_PAY,
  ACTION_RECEIVE_PAYMENT_STATUS,
  STATUS_PENDING,
  STATUS_ERROR,
  STATUS_SUCCESS
} from './consts';

function apiGET(url) {
  const headers = {
    'content-type': 'application/json'
  };
  if (localStorage.getItem('onecart.cid')) {
    headers['x-onecart-cid'] = localStorage.getItem('onecart.cid');
  }

  return fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    headers,
    mode: 'cors'
  })
  .then(res => res.json());
}

function apiPOST(url, data) {
  const headers = {
    'content-type': 'application/json'
  };
  if (localStorage.getItem('onecart.cid')) {
    headers['x-onecart-cid'] = localStorage.getItem('onecart.cid');
  }

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-cache',
    headers,
    mode: 'cors'
  })
  .then(res => res.json());
}

export function showSummary(anchor) {
  function offset(element) {
    if (element.offsetParent === document.body) {
      return { left: element.offsetLeft, top: element.offsetTop };
    } else {
      const offsetParent = offset(element.parent);
      return {
        left: element.offsetLeft + offsetParent.left,
        top: element.offsetTop + offsetParent.top
      };
    }
  }

  const anchorOffset = offset(anchor);
  const anchorSize = {
    width: anchor.clientWidth,
    height: anchor.clientHeight
  };

  return (dispatch) => {
    dispatch({
      type: ACTION_SHOW_SUMMARY,
      payload: {
        left: anchorOffset.left + anchorSize.width,
        top: anchorOffset.top + anchorSize.height
      }
    });
  }
}

export function showCart() {
  return (dispatch) => {
    dispatch({
      type: ACTION_SHOW_CART
    });
  }
}

export function hideAll() {
  return dispatch => {
    dispatch({
      type: ACTION_HIDE_CART
    });
  };
}

export function initCart(appid) {
  return (dispatch) => {
    dispatch({
      type: ACTION_INIT_CART,
      status: STATUS_PENDING
    });

    const cart = new Promise((resolve, reject) => {
      if (localStorage.getItem('onecart.cid')) {
        const cid = localStorage.getItem('onecart.cid');
        return fetch(`/${appid}/api/cart`, {
          method: 'GET',
          cache: 'no-cache',
          headers: {
            'content-type': 'application/json',
            'x-onecart-cid': cid
          },
          mode: 'cors'
        })
        .then(res => {
          if (res.status === 400) {
            console.warn(`Cart identified by ${cid} not found`);
            createCart();
          } else {
            resolve(res.json())
          }
        })
      } else {
        createCart();
      }

      function createCart() {
        return fetch(`/${appid}/api/cart`, {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'content-type': 'application/json'
          },
          mode: 'cors'
        })
        .then(res => res.json())
        .then(data => {
          const {cid} = data;
          localStorage.setItem('onecart.cid', cid);

          delete data.cid;
          resolve(data);
        })
        .catch(reject);
      }
    });

    cart.then(data => {
      dispatch({
        type: ACTION_INIT_CART,
        status: STATUS_SUCCESS,
        payload: {
          ...data,
          appid
        }
      });
    })
    .catch(err => {
      dispatch({
        type: ACTION_INIT_CART,
        status: STATUS_ERROR,
        payload: err
      });
    });
  };
}

export function updateCart(id, qty) {
  return (dispatch, getState) => {
    const {appid} = getState();
    dispatch({
      type: ACTION_UPDATE_CART,
      status: STATUS_PENDING,
      payload: {
        id, qty
      }
    });

    fetch(`/${appid}/api/cart`, {
      method: 'PUT',
      body: JSON.stringify([{id, qty}]),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json',
        'x-onecart-cid': localStorage.getItem('onecart.cid')
      },
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: ACTION_UPDATE_CART,
        status: STATUS_SUCCESS,
        payload: data
      });
    })
    .catch(err => {
      dispatch({
        type: ACTION_UPDATE_CART,
        status: STATUS_ERROR,
        payload: err
      });
    });
  };
}

export function removeCartItem(id) {
  return (dispatch, getState) => {
    const {appid} = getState();
    dispatch({
      type: ACTION_REMOVE_ITEM,
      status: STATUS_PENDING,
      payload: {
        id
      }
    });

    fetch(`/${appid}/api/cart`, {
      method: 'DELETE',
      body: JSON.stringify({id}),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json',
        'x-onecart-cid': localStorage.getItem('onecart.cid')
      },
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: ACTION_UPDATE_CART,
        status: STATUS_SUCCESS,
        payload: data
      });
    })
    .catch(err => {
      dispatch({
        type: ACTION_UPDATE_CART,
        status: STATUS_ERROR,
        payload: err
      });
    });
  };
}

export function checkout() {
  return (dispatch, getState) => {
    const {appid, items} = getState();
    const updatedItems = items.map(it => ({...it, qty: parseInt(it.qty, 10)}));

    dispatch({
      type: ACTION_CHECKOUT,
      status: STATUS_PENDING,
      payload: {items: updatedItems}
    });

    apiPOST(`/${appid}/api/checkout`, {items: updatedItems})
    .then(data => {
      dispatch({
        type: ACTION_CHECKOUT,
        status: STATUS_SUCCESS,
        payload: data
      });
    })
    .catch(error => {
      dispatch({
        type: ACTION_CHECKOUT,
        status: STATUS_ERROR,
        payload: error
      });
    })
  };
}

export function placeOrder() {
  return (dispatch, getState) => {
    const {appid, order: {id}} = getState();

    dispatch({
      type: ACTION_PLACE_ORDER,
      status: STATUS_PENDING,
      payload: {id}
    });

    apiPOST(`/${appid}/api/orders`, {id})
    .then(data => {
      localStorage.setItem('onecart.cid', data.next_cid);
      dispatch({
        type: ACTION_PLACE_ORDER,
        status: STATUS_SUCCESS,
        payload: data
      });
    })
    .catch(error => {
      dispatch({
        type: ACTION_PLACE_ORDER,
        status: STATUS_ERROR,
        payload: error
      });
    })
  };
}

export function pay() {
  return (dispatch, getState) => {
    const {appid, order: {id}} = getState();

    dispatch({
      type: ACTION_PAY,
      status: STATUS_PENDING,
      payload: {id}
    });

    apiPOST(`/${appid}/api/orders`, {id})
    .then(({order, next_cid}) => {
      localStorage.setItem('onecart.cid', next_cid);
      return apiPOST(`/${appid}/api/pay`, {id}).then(payment => ({
        order, payment
      }));
    })
    .then(data => {
      const { order, payment } = data;

      dispatch({
        type: ACTION_PAY,
        status: STATUS_SUCCESS,
        payload: {
          payment: {
            method: payment.method,
            paymentUrl: payment.payment_url
          },
          order
        }
      });

      window.open(payment.payment_url);
      function handleMessage (e) {
        window.removeEventListener('message', handleMessage);

        let message = e.data;
        let payload;
        if (message === 'onecart.paypal.complete') {
          payload = Object.assign({}, payment, {status: 'complete'});
        } else if (message === 'onecart.paypal.cancel') {
          payload = Object.assign({}, payment, {status: 'cancel'});
        } else {
          return;
        }

        dispatch({
          type: ACTION_RECEIVE_PAYMENT_STATUS,
          status: STATUS_SUCCESS,
          payload
        });
      }

      window.addEventListener('message', handleMessage);
    })
    .catch(error => {
      dispatch({
        type: ACTION_PAY,
        status: STATUS_ERROR,
        payload: error
      });
    });
  };
}
