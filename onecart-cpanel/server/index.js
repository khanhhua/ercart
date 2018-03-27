/* eslint-env node */
'use strict';

// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
// module.exports = function(app) {
//   app.get('/ember-hamsters', function(req, res) {
//     res.send('hello');
//   });
// };

// @see https://discuss.emberjs.com/t/how-to-disable-http-mock-server-within-environment-config-file/6660/8
function usingProxy() {
    return !!process.argv.filter(function (arg) {
        return arg.indexOf('--proxy') === 0;
    }).length;
}

module.exports = function(app) {
  if (usingProxy()) {
    console.log('Mocks are disabled due to --proxy flag')
    return;
  }

  const globSync   = require('glob').sync;
  const mocks      = globSync('./mocks/**/*.js', { cwd: __dirname }).map(require);
  const proxies    = globSync('./proxies/**/*.js', { cwd: __dirname }).map(require);

  // Log proxy requests
  const morgan = require('morgan');
  app.use(morgan('dev'));

  mocks.forEach(route => route(app));
  proxies.forEach(route => route(app));
};
