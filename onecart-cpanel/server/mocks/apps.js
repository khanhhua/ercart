/* eslint-env node */
'use strict';

module.exports = function(app) {
  const express = require('express');
  let appsRouter = express.Router();

  appsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/apps', require('body-parser').json());
  app.use('/api/apps', appsRouter);
};
