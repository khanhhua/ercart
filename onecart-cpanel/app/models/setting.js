import DS from 'ember-data';

export default DS.Model.extend({
  name: Ember.computed(function () {
    debugger
    return this.get('id');
  }),
  value: DS.attr()
});
