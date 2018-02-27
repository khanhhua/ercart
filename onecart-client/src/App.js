import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactDOM from 'react-dom';
// import logo from './logo.svg';
import {VIEW_NONE, VIEW_CART, VIEW_SUMMARY, VIEW_ORDER, VIEW_PAYMENT, VIEW_THANK_YOU, VIEW_PAYMENT_CANCELLED} from './consts';
import {
  showCart,
  showSummary,
  hideAll,

  initCart,
  updateCart,
  removeCartItem,
  checkout,
  placeOrder,
  pay } from './actions';
import {isTouchDevice} from './funs';

class App extends Component {
  componentDidMount() {
    this.props.actions.initCart(this.props.appid);
  }

  componentDidUpdate() {
    if (this.props.view !== VIEW_NONE && this.props.view !== VIEW_SUMMARY) {
      const node = ReactDOM.findDOMNode(this.modal);
      node.style = 'display:block;';

      setTimeout(() => {
        node.classList.add('show');
      }, 300);
    } else if (this.dropdown) {
      const node = ReactDOM.findDOMNode(this.dropdown);
      node.focus();
      !isTouchDevice() && node.addEventListener('blur', () => {
        node.className = 'onecart-summary fading-out';
        node.addEventListener('animationend', () => this.hideAll())
      });
    }
  }

  hideAll() {
    this.props.actions.hideAll();
  }

  showSummary() {
    this.props.actions.showSummary();
  }

  showCart() {
    this.props.actions.showCart();
  }

  updateCart(id, qty) {
    this.props.actions.updateCart(id, qty);
  }

  checkout() {
    this.props.actions.checkout();
  }

  pay() {
    // TODO Implement payment
    this.props.actions.pay();
  }

  placeOrder() {
    this.props.actions.placeOrder();
  }

  render() {
    const isEmptyCart = !(this.props.items && this.props.items.length);

    return (
      <div className="onecart">
        {(this.props.view === VIEW_SUMMARY)&&
        <div className="onecart-summary" tabIndex={1}
          ref={node => this.dropdown = node}
          style={
            {
              left: `${this.props.ui.left}px`,
              top: `${this.props.ui.top}px`}}>
          <div className="modal-body">
            {isEmptyCart &&
            <p className="text-center">Empty cart</p>
            }
            {!isEmptyCart &&
            <ul className="list-group list-group-flush">
            {this.props.items.map((it, i) =>
              <li className="list-group-item" key={i}>
                {it.name}
                <span className="float-right">{it.qty}</span>
              </li>
            )}
            </ul>
            }
          </div>
          <div className="modal-footer">
            <div className="btn-group">
              <a className="btn btn-sm btn-default" href="#" onClick={() => this.hideAll()}>Close</a>
              {!isEmptyCart &&
              <a className="btn btn-sm btn-primary" href="#" onClick={() => this.showCart()}>Details</a>
              }
            </div>
          </div>
        </div>
        }
        {(this.props.view === VIEW_CART)&&
        <div className="onecart-cart">
          <div className="modal fade" tabIndex="-1" role="dialog" ref={(node) => this.modal = node}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Your cart</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true" onClick={() => this.hideAll()}>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {isEmptyCart &&
                  <p className="text-center">Empty cart</p>
                  }
                  {!isEmptyCart &&
                  <ul className="list-group list-group-flush">
                  {this.props.items.map((it, i) =>
                    <li className="list-group-item" key={i}>
                      {it.name}
                      <div className="float-right input-group" style={{width: 140}}>
                        <input type="number" className="form-control" value={it.qty}
                               onChange={({target:{value}}) => this.updateCart(it.id, value)} />
                        <div className="input-group-append">
                          <button className="btn btn-outline-secondary" type="button"
                                  onClick={() => this.props.actions.removeCartItem(it.id)}>Remove</button>
                        </div>
                      </div>
                    </li>
                  )}
                  </ul>
                  }
                </div>
                <div className="modal-footer">
                  {!isEmptyCart &&
                  <button type="button" className="btn btn-primary" onClick={() => this.checkout()}>Check out now!</button>
                  }
                  <button type="button" className="btn btn-secondary" onClick={() => this.hideAll()}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
        {this.props.view === VIEW_ORDER &&
        <div className="onecart-order">
          <div className="modal fade" tabIndex="-1" role="dialog" ref={(node) => this.modal = node}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Your cart</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                <ul className="list-group list-group-flush">
                {this.props.order.items.map((it, i) =>
                  <li className="list-group-item" key={i}>
                    {it.name}
                    <div className="float-right">
                    {it.qty}
                    </div>
                  </li>
                )}
                </ul>
                <dl className="row text-right mt-3">
                  <dt className="col-8">Total</dt>
                  <dd className="col-4">{this.props.order.total} {this.props.order.currency}</dd>
                </dl>
                </div>
                <div className="modal-footer">
                  {process.env.FEAT_PAYMENT &&
                  <button type="button" className="btn btn-success" onClick={() => this.pay()}>
                  Make payment
                  </button>
                  }
                  {!process.env.FEAT_PAYMENT &&
                  <button type="button" className="btn btn-success" onClick={() => this.placeOrder()}>
                  Place order
                  </button>
                  }
                  <button type="button" className="btn btn-secondary" onClick={() => this.hideAll()}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
        {(this.props.view === VIEW_PAYMENT)&&
        <div className="onecart-payment">
          <div className="modal fade" tabIndex="-1" role="dialog" ref={(node) => this.modal = node}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Payment</h5>
                </div>
                <div className="modal-body">
                  <p>You&apos;ve been redirected to PayPal page...</p>
                  <p>Please finalize your payment. Thank you!</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => this.hideAll()}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        }

        {(this.props.view === VIEW_THANK_YOU)&&
        <div className="onecart-thank-you">
          <div className="modal fade" tabIndex="-1" role="dialog" ref={(node) => this.modal = node}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Your cart</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Thank you!</p>
                  <p>Reference no.:<span>{this.props.order.refno}</span></p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => this.hideAll()}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
        {(this.props.view === VIEW_PAYMENT_CANCELLED)&&
          <div className="onecart-payment--cancelled">
            <div className="modal fade" tabIndex="-1" role="dialog" ref={(node) => this.modal = node}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Your cart</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>Payment cancelled!</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => this.hideAll()}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui,
    order: state.order,
    payment: state.payment,
    items: state.items,
    view: state.view || VIEW_NONE
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      showCart,
      showSummary,
      hideAll,
      initCart,
      updateCart,
      removeCartItem,
      checkout,
      placeOrder,
      pay
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapActionsToProps)(App);
