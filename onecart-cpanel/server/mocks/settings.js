/* eslint-env node */
'use strict';

const settings = require('./settings.json');

module.exports = function(app) {
  const express = require('express');
  let settingsRouter = express.Router();

  settingsRouter.get('/', function(req, res) {
    res.send({
      settings
    });
  });

  settingsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  settingsRouter.get('/:id', function(req, res) {
    res.send({
      'settings': {
        id: req.params.id
      }
    });
  });

  settingsRouter.put('/:id', function(req, res) {
    res.send({
      'settings': {
        id: req.params.id
      }
    });
  });

  settingsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/settings', require('body-parser').json());
  app.use('/api/settings', settingsRouter);
};
