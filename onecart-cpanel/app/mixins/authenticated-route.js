import Mixin from '@ember/object/mixin';

export default Mixin.create({
  beforeModel(transition) {
    if (!this.get('authService.isAuthed')) {
      if (transition.targetName === 'login') {
        return true;
      } else {
        this.transitionTo('login');
      }
    } else if (transition.targetName === 'login' || transition.targetName === 'index') {
      // Default route
      this.transitionTo('authed.products', {appid: this.get('authService.appid')});
    }
    // Otherwise no route modification is required
  }
});
