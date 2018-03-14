/* eslint-env node */
'use strict';

const discounts = require('./discounts.json');

module.exports = function(app) {
  const express = require('express');
  let discountsRouter = express.Router();

  discountsRouter.get('/', function(req, res) {
    res.send({
      discounts
    });
  });

  discountsRouter.post('/', function(req, res) {
    const {discount} = req.body;
    discounts.push(discount);

    res.status(201).send({discount}).end();
  });

  discountsRouter.post('/:id', function(req, res) {
    const {id} = req.params;
    const {action} = req.query;

    if (action === 'activate') {
      const discount = discounts.find(it => it.id === id);
      if (!discount) {
        return res.status(404).send('Discount not found').end();
      }

      discount.status = 'active';
    }

    res.status(200).end();
  });

  discountsRouter.get('/:id', function(req, res) {
    const {id} = req.params;
    const discount = discounts.find(it => it.id === id);

    res.send({
      discount
    });
  });

  discountsRouter.put('/:id', function(req, res) {
    const {id} = req.params;
    const {discount: data} = req.body;

    const discount = discounts.find(it => it.id === id);
    if (discount.status === 'active') {
      return res.status(400).send('Active discount in use cannot be changed').end();
    }

    console.log(`Updating discount ${id}...`);

    discounts.splice(discounts.findIndex(it => it.id === id), 1, Object.assign({}, data, {id}));
    res.send({discount: Object.assign({}, data, {id})});
  });

  discountsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  app.use('/api/discounts', require('body-parser').json());
  app.use('/api/discounts', discountsRouter);
};
