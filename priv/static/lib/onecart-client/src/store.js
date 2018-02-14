import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {ACTION_HIDE_CART, VIEW_CART, VIEW_NONE, VIEW_SUMMARY} from './consts';
import {ACTION_UPDATE_CART, ACTION_SHOW_SUMMARY, ACTION_SHOW_CART, ACTION_REMOVE_ITEM} from './consts';

function reducer(state = {items:[]}, action) {
  console.info('REDUCER:', action);
  let newState = Object.assign({}, state);

  switch (action.type) {
    case ACTION_SHOW_SUMMARY: {
      return {
        ...newState,
        view: VIEW_SUMMARY
      };
    }
    case ACTION_SHOW_CART: {
      return {
        ...newState,
        view: VIEW_CART
      };
    }
    case ACTION_HIDE_CART: {
      return {
        ...newState,
        view: VIEW_NONE
      };
    }
    case ACTION_UPDATE_CART: {
      const {payload: {id, product, qty}} = action;
      const {items} = newState;
      const itemIndex = items.findIndex(it => it.id === id);

      if (itemIndex !== -1) {

        return {
          ...newState,
          items: items.map((it, i) => ((i === itemIndex)?{id, product, qty}:it))
        };
      } else {
        return {
          ...newState,
          items: [...items, {id, product, qty}]
        };
      }
    }
    case ACTION_REMOVE_ITEM:
      let id = action.payload.id;
      const {items} = state;
      const itemIndex = items.findIndex(it => it.id === id);

      if (itemIndex !== -1) {
        return {
          ...newState,
          items: items.reduce((acc, it, i) => ((i === itemIndex)?acc:(acc.concat(it))), [])
        };
      } else {
        return newState;
      }
  }

  return newState;
}

export default function (initialState = {items:[]}) {
  return createStore(reducer, initialState, applyMiddleware(thunk));
}