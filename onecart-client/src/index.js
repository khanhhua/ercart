import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {Provider} from 'react-redux';
import createStore from './store';
import App from './App';
import {showSummary, showCart, updateCart} from './actions';
import {isTouchDevice} from './funs';
// Global exports

window.ONECART = {
  init ({appid}) {
    const root = document.createElement('div');
    root.setAttribute('id','onecart-root');
    document.body.appendChild(root);

    var store = createStore();
    const cartButtons = document.querySelectorAll('[onecart-toggle]');
    cartButtons && cartButtons.forEach(it => it.addEventListener('click', ({target}) => {
      if (isTouchDevice()) {
        store.dispatch(showCart());
      } else {
        store.dispatch(showSummary(target));
      }
    }));

    const addToCartButtons = document.querySelectorAll('[onecart-add-to-cart]');
    addToCartButtons && addToCartButtons.forEach(it => it.addEventListener('click', (e) => {
      const { target } = e;
      const data = target.getAttribute('onecart-add-to-cart').split(';')
          .map(decl => decl.split(':'))
          .reduce((acc, [key,value]) => {
            acc[key] = value;
            return acc;
          }, {});

      const {id,qty} = data;
      store.dispatch(updateCart(id, qty));
    }));

    ReactDOM.render(<Provider store={store}><App appid={appid} /></Provider>, root);
  }
};
