/* eslint-env node */
'use strict';
const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports = function(app) {
  const express = require('express');
  let paymentRouter = express.Router();

  const PAYPAL_APP_HEADERS = {
    'X-PAYPAL-SECURITY-USERID': 'giakhanh2487-facilitator_api1.gmail.com',
    'X-PAYPAL-SECURITY-PASSWORD': 'AS8HZXUK4W5TCMT4',
    'X-PAYPAL-SECURITY-SIGNATURE': 'AGRlivd-w1.x76rooYVtlFKN43YvATyO-4szvUn562ZvG8SHpOcvomu0',
    'X-PAYPAL-REQUEST-DATA-FORMAT': 'JSON',
    'X-PAYPAL-RESPONSE-DATA-FORMAT': 'JSON',
    'X-PAYPAL-APPLICATION-ID': 'APP-80W284485P519543T',
  };

  paymentRouter.get('/authorize', function(req, res) {
    const {request_token: token, verification_code: code} = req.query;

    const body = `{
         "requestEnvelope": {
           "errorLanguage":"en_US"
         },
         "token":"${token}",
         "verifier":"${code}"
       }`;
    request({
      url: 'https://svcs.sandbox.paypal.com/Permissions/GetAccessToken',
      method: 'POST',
      headers: PAYPAL_APP_HEADERS,
      body
    }, (err, res0, body) => {
      const data = JSON.parse(body);

      if (data.error) {
        return res.status(500).end();
      }
      const payment = {
        paypal: {
          token: data.token,
          tokenSecret: data.tokenSecret
        }
      };
      console.log(data);
      fs.writeFileSync(path.join(__dirname, '../../tmp/.paymentrc'), JSON.stringify(payment, true, 2));

      res.status(200).send(`
      <p>Redirecting...</p>
      <script>
      window.opener.postMessage({
        "type":"paypal.auth.success",
        "payer_id": "giakhanh2487-seller01@gmail.com"
      }, '*');
      setTimeout(function() { window.close() }, 500);
      </script>
      `).end();

      // TODO Generate AuthSignature for the given HTTP METHOD, endpoint, api key, api pass, token, token secret
      // const signature = 'HMACSHA1';
      /**
       * $auth->genSign($callerUid,$callerPswd,$accessToken,$tokenSecret,'POST',$endpoint);
       * $authString = "token=" . $accessToken . ",signature=" . $response['oauth_signature'] . ",timestamp=" . $response['oauth_timestamp'];
       */

      // const headers = {
      //   'X-PAYPAL-APPLICATION-ID': 'APP-80W284485P519543T',
      //   'X-PAYPAL-REQUEST-DATA-FORMAT': 'JSON',
      //   'X-PAYPAL-RESPONSE-DATA-FORMAT': 'JSON',
      //   'X-PAYPAL-AUTHORIZATION': `token=${data.token},signature=${signature},timestamp=${Date.parse(data.responseEnvelope.timestamp)}`
      // };
      // console.log(headers);
      //
      // request({
      //   headers,
      //   url: 'https://svcs.sandbox.paypal.com/Permissions/GetBasicPersonalData',
      //   method: 'POST',
      //   body: `{
      //     "attributeList": {
      //       "attribute": "http://axschema.org/contact/email"
      //     },
      //     "requestEnvelope": {
      //       "errorLanguage":"en_US"
      //     }
      //   }`,
      // }, (err, res1, body) => {
      //   console.log("https://svcs.sandbox.paypal.com/Permissions/GetBasicPersonalData");
      //   const data = JSON.parse(body);
      //   console.log(data);
      //
      //   res.status(200).send(body).end();
      // });
    });
  });

  paymentRouter.post('/authorize', function(req, res) {
    const body = `{
      "requestEnvelope": {
        "errorLanguage":"en_US"
      },
      "scope": ["EXPRESS_CHECKOUT", "ACCESS_BASIC_PERSONAL_DATA"],
      "callback": "http://localhost:4200/api/payment/authorize"
    }`;

    request(
      {
        url: 'https://svcs.sandbox.paypal.com/Permissions/RequestPermissions',
        method: 'POST',
        headers: PAYPAL_APP_HEADERS,
        body
      }, (err, _res0, body) => {
        const data = JSON.parse(body);
        console.log(data);

        if (data.error) {
          console.error(data.error);
          return res.status(500).send(data.error).end();
        }

        res.status(200).send({
          token: data.token
        }).end();
      });
  });

  // paymentRouter.get('/:id', function(req, res) {
  //   res.send({
  //     'payment': {
  //       id: req.params.id
  //     }
  //   });
  // });
  //
  // paymentRouter.put('/:id', function(req, res) {
  //   res.send({
  //     'payment': {
  //       id: req.params.id
  //     }
  //   });
  // });
  //
  // paymentRouter.delete('/:id', function(req, res) {
  //   res.status(204).end();
  // });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/payment', require('body-parser').json());
  app.use('/api/payment', paymentRouter);
};
