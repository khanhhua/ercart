import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {VIEW_CART, VIEW_NONE, VIEW_SUMMARY} from './consts';
import {
  ACTION_HIDE_CART,
  ACTION_INIT_CART,
  ACTION_UPDATE_CART,
  ACTION_SHOW_SUMMARY,
  ACTION_SHOW_CART,
  ACTION_REMOVE_ITEM
} from './consts';
import {STATUS_SUCCESS} from './consts';

function reducer(state = {items:[]}, action) {
  console.info('REDUCER:', action);
  let newState = Object.assign({}, state);

  if ('status' in action) {
    if (action.status !== STATUS_SUCCESS) {
      return state;
    }
  }

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
    case ACTION_INIT_CART: {
      const {payload: {appid, cid}} = action;
      return {
        ...newState,
        appid,
        cid
      };
    }
    case ACTION_UPDATE_CART: {
      const {payload: items} = action;
      return {
        ...newState,
        items
      };
    }
    case ACTION_REMOVE_ITEM:
      const {payload: items} = action;
      return {
        ...newState,
        items
      };
  }

  return newState;
}

export default function (initialState = {items:[]}) {
  return createStore(reducer, initialState, applyMiddleware(thunk));
}