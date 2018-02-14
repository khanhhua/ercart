import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

export default function (selector) {
  ReactDOM.render(<App />, document.querySelector(selector));
}
