import DS from 'ember-data';

export default DS.Model.extend({
  promocode: DS.attr('string'),
  expiry: DS.attr('isodate'),
  status: DS.attr('string'),
  instances: DS.attr()
});
