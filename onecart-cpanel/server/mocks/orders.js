/* eslint-env node */
'use strict';

const orders = require('./orders.json');

module.exports = function(app) {
  const express = require('express');
  let ordersRouter = express.Router();

  ordersRouter.get('/', function(req, res) {
    res.send({
      orders
    });
  });

  ordersRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  ordersRouter.get('/:id', function(req, res) {
    const order = orders.find(it => it.id === req.params.id);

    res.send({
      order
    });
  });

  ordersRouter.put('/:id', function(req, res) {
    res.send({
      'orders': {
        id: req.params.id
      }
    });
  });

  ordersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/orders', require('body-parser').json());
  app.use('/api/orders', ordersRouter);
};
