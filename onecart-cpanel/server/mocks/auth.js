/* eslint-env node */
'use strict';
const fs = require('fs');
const publicKey = fs.readFileSync(__dirname + '/../config/public.pem');
const privateKey = fs.readFileSync(__dirname + '/../config/private.pem');
const jwt = require('jsonwebtoken');

module.exports = function(app) {
  const express = require('express');
  let authRouter = express.Router();

  authRouter.get('/public-enc-key', function(req, res) {
    res.send(publicKey);
  });

  authRouter.post('/login', function(req, res) {
    const {appid, password} = req.body;
    console.log(`login: appid=${appid}, enc.password: ${password}`);
    if (appid !== 'A000001') {
      return res.status(403).send('Invalid AppID or wrong password').end();
    }

    const claims = {
      iss: 'onecart',
      aud: appid,
      sub: appid,
      iat: Math.floor(Date.now() / 1000)
    };
    const token = jwt.sign(claims, privateKey, {
      expiresIn: '1h'
    });

    res.status(200).send({jwt: token}).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  app.use('/api/auth', require('body-parser').json());
  app.use('/api/auth', authRouter);
};
