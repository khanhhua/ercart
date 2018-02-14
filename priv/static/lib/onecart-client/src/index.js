import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Global exports

window.ONECART = {
  init ({appid}) {
    const root = document.createElement('div');
    root.setAttribute('id','onecart-root');
    document.body.appendChild(root);

    var app = ReactDOM.render(<App />, root);


    const cartButtons = document.querySelectorAll('[onecart-toggle]');
    cartButtons && cartButtons.forEach(it => it.addEventListener('click', () => { app.showSummary() }));
  }
};

