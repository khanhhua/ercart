import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel(transition) {
    const {token: uriFriendlyToken} = transition.queryParams;
    if (uriFriendlyToken && transition.sequence === 0) {
      const token = decodeURIComponent(uriFriendlyToken);
      window.localStorage.setItem('onecart-token', token);
      const [,payload,] = token.split('.');
      const claims = JSON.parse(atob(payload));
      this.transitionTo('authed.products', {appid: claims.sub});
    } else if (this.get('authService.isAuthed')) {
      return true;
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
