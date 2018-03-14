/* eslint-env node */
'use strict';

const fs = require('fs');
const path = require('path');

const products = require('./products.json');

function delay(req, res, next) {
  setTimeout(function () {
    next()
  }, 2000);
}

module.exports = function(app) {
  const express = require('express');
  let productsRouter = express.Router();

  productsRouter.get('/', delay, function(req, res) {
    res.send({
      products
    });
  });

  productsRouter.post('/', delay, function(req, res) {
    const {product} = req.body;
    if (product.price < 0) {
      return res.status(400).send('Invalid product properties').end();
    }
    products.push(product);

    res.status(201).send({product}).end();
  });

  productsRouter.get('/:id', delay, function(req, res) {
    const {id} = req.params;
    const product = products.find(it => it.id === id);
    res.send({product});
  });

  productsRouter.put('/:id', delay, function(req, res) {
    const {id} = req.params;
    const {product} = req.body;

    console.log(`Updating product ${id}...`);

    products.splice(products.findIndex(it => it.id === id), 1, Object.assign({},product, {id}));
    res.send({product: Object.assign({},product, {id})});
  });

  productsRouter.delete('/:id', delay, function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  app.use('/api/products', require('body-parser').json());
  app.use('/api/products', productsRouter);

  process.on('SIGINT', () => {
    fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(products, true, 2));
  })
};
