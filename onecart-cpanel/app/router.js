import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');

  this.route('authed', {path:'/:appid'}, function () {
    this.route('orders', { path: 'orders' });
    this.route('products', { path: 'products' });
    this.route('product-create', { path: 'products/new' });
    this.route('product-edit', { path: 'products/:id' });
    this.route('discounts', { path: 'discounts' });
    this.route('discount-create', { path: 'discounts/new' });
    this.route('discount-detail', { path: 'discounts/:id' });
    this.route('discount-edit', { path: 'discounts/:id/edit' });
    this.route('payment', { path: 'settings/payment' });
    this.route('order-detail', { path: 'orders/:id' });
  });
});

export default Router;
