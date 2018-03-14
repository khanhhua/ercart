import Ember from 'ember';
import Route from '@ember/routing/route';
import AuthenticatedRoute from '../../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  model({id}) {
    return this.get('store').find('discount', id);
  },
  actions: {
    activate() {
      const id = this.currentModel.get('id');
      Ember.$.ajax(`/api/discounts/${id}?action=activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.get('authService.accessToken')}`
        }
      }).promise().then(() => {
        this.refresh();
      })
    }
  }
});
