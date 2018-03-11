import Route from '@ember/routing/route';
import AuthenticatedRoute from '../../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  model() {
    return {
      promocode: undefined,
      expiry: undefined,
      status: 'inactive'
    };
  },
  actions: {
    save(discount) {
      if (!this.controllerFor('authed.discount-create').validate(discount)) {
        return;
      }

      const record = this.get('store').createRecord('discount');
      record.setProperties(discount);

      record.save()
        .then(() => {
          this.controllerFor('application').set('notification', 'New discount has been created.');
        })
        .catch(({errors}) => {
          record.unloadRecord();

          const error = errors[0];
          this.controllerFor('application').set('serverError', `${error.title}. ${error.detail}`);
        });
    }
  }
});
