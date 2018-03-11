import Route from '@ember/routing/route';

export default Route.extend({
  model({id}) {
    return this.get('store').find('discount', id);
  },
  actions: {
    save(discount) {
      if (!this.controllerFor('authed.discount-edit').validate(discount)) {
        return;
      }

      discount.save()
        .then(() => {
          this.controllerFor('application').set('notification', 'Discount has been updated.');
        })
        .catch(({errors}) => {
          const error = errors[0];
          this.controllerFor('application').set('serverError', `${error.title}. ${error.detail}`);
        });
    }
  }
});
