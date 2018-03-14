import Ember from 'ember';
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return {
      appid: '',
      password: ''
    };
  },
  actions: {
    login({appid, password}) {
      this.get('authService').login(appid, password)
        .then(() => {
          this.transitionTo('authed.products', {appid});
        })
        .catch(error => {
          this.controllerFor('application').set('serverError', error.responseText);
        });
    }
  }
});
