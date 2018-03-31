import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel(transition) {
    const {token} = transition.queryParams;
    if (this.get('authService.isAuthed')) {
      return true;
    } else if (token) {
      window.localStorage.setItem('onecart-token', decodeURIComponent(token));
      this.transitionTo('authed.products');
    } else {
      this.transitionTo('login');
    }
  },
  model({appid}) {
    console.info(`Loading appid ${appid}...`);
    return {appid};
  },
  actions: {
    logout() {
      this.get('authService').logout().then(() => {
        this.transitionTo('login');
      });
    }
  }
});
