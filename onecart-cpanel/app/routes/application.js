import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    dismiss() {
      const ctrl = this.controllerFor('application');

      ctrl.set('serverError', null);
      ctrl.set('notification', null);
    }
  }
});
