import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  namespace: 'api',
  headers: Ember.computed('authService.accessToken', function (name) {
    const accessToken = Ember.get(this, 'authService.accessToken');
    if (!accessToken) {
      return {};
    }

    return {
      'Authorization': `Bearer ${accessToken}`
    };
  }).volatile()
});
