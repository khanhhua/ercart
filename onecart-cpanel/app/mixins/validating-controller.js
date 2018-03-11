import Ember from 'ember';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  errors: {},
  validate(model) {
    const errors = {};

    this.get('validation.required').forEach(field => {
      if (!Ember.get(model, field)) {
        errors[field] = 'required';
      }
    });

    this.set('errors', errors);
    this.notifyPropertyChange('errors');
    return !Object.keys(errors).length
  },
  hasErrors: computed('errors', function () {
    return Object.keys(this.get('errors')).length !== 0;
  })
});
