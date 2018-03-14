import Route from '@ember/routing/route';
import AuthenticatedRoute from '../../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  model() {
    return {
      id: undefined,
      name: '',
      price: undefined
    };
  },

  actions: {
    save(product) {
      if (!this.controllerFor('authed.product-create').validate(product)) {
        return;
      }

      const record = this.get('store').createRecord('product', product);
      record.save()
        .then(() => {
          this.controllerFor('application').set('notification', 'New product has been created.');
        })
        .catch(({errors}) => {
          record.unloadRecord();

          const error = errors[0];
          this.controllerFor('application').set('serverError', `${error.title}. ${error.detail}`);
        });
    }
  }
});
