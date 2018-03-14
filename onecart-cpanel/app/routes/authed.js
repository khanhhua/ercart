import Route from '@ember/routing/route';

export default Route.extend({
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
