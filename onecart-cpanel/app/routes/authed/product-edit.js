import Route from '@ember/routing/route';

export default Route.extend({
  model({id}) {
    return this.get('store').find('product', id);
  },
  actions: {
    save(product) {
      if (!this.controllerFor('authed.product-edit').validate(product)) {
        return;
      }

      product.save()
        .then(() => {
          this.controllerFor('application').set('notification', 'Product has been updated.');
        })
        .catch(({errors}) => {
          const error = errors[0];
          this.controllerFor('application').set('serverError', `${error.title}. ${error.detail}`);
        });
    }
  }
});
