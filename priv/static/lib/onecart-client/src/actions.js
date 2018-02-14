import {
  ACTION_REMOVE_ITEM,
  ACTION_SHOW_SUMMARY,
  ACTION_UPDATE_CART,
  ACTION_SHOW_CART,
  ACTION_INIT_CART,
  ACTION_HIDE_CART,
  STATUS_PENDING,
  STATUS_ERROR,
  STATUS_SUCCESS
} from './consts';

export function showSummary() {
  return (dispatch) => {
    dispatch({
      type: ACTION_SHOW_SUMMARY
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

    fetch(`/${appid}/api/cart`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json'
      },
      mode: 'cors'
    })
    .then(res => res.json())
    .then(data => {
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
        'content-type': 'application/json'
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
        'content-type': 'application/json'
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