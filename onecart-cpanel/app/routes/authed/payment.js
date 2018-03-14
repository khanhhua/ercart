import Route from '@ember/routing/route';
import AuthenticatedRoute from '../../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  model() {
    return this.get('store').findAll('setting').then(data => data.filter(it => it.id.indexOf('payment') === 0));
  },
  actions: {
    authorize(methodName) {
      // TODO Authorize using Permission Service
      const controller = this.controllerFor('authed.payment');
      controller.authorize(methodName);
    },
    save(settings) {
      this.get('store').findAll('setting').then(data => {
        settings.forEach(item => {
          const current = data.get('[]').find(it => it.get('id') === item.get('id'));
          current.set('value', item.get('value'));
        });

        data.save();
      })
    }
  }
});
