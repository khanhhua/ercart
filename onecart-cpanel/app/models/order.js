import DS from 'ember-data';

export default DS.Model.extend({
  refno: DS.attr('string'),
  status: DS.attr('string'),
  items: DS.attr(),
  total: DS.attr('number')
});
