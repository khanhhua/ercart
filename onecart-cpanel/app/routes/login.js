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
        .then((authToken) => {
          const uriFriendlyToken = encodeURIComponent(authToken);
          const host = window.location.host; // hostname + port

          if (window.location.hostname === 'localhost') {
            window.location.href = `http://${host}/authed?token=${uriFriendlyToken}`;
          } else {
            window.location.href = `http://${appid}.${host}/authed?token=${uriFriendlyToken}`;
          }
        })
        .catch(error => {
          this.controllerFor('application').set('serverError', error.responseText);
        });
    }
  }
});
