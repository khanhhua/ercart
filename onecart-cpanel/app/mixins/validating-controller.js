import Ember from 'ember';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  errors: {},
  validate(model) {
    const errors = {};
    if (this.get('validation.required')) {
      this.get('validation.required').forEach(field => {
        if (!Ember.get(model, field)) {
          errors[field] = 'required';
        }
      });
    }

    if (this.get('validation.length')) {
      this.get('validation.length').forEach(([field, specs]) => {
        if (field in errors) {
          return;
        }

        const value = Ember.get(model, field);
        const { min, max } = specs;

        if (value.length < min) {
          errors[field] = 'too short';
        } else if (value.length > max) {
          errors[field] = 'too long';
        }
      });
    }

    if (this.get('validation.email')) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.get('validation.email').forEach(field => {
        if (field in errors) {
          return;
        }

        const value = Ember.get(model, field);
        if (!value || !value.length) {
          return;
        }
        if (!re.test(String(value).toLowerCase())) {
          errors[field] = 'an invalid email';
        }
      })
    }

    this.set('errors', errors);
    this.notifyPropertyChange('errors');
    return !Object.keys(errors).length;
  },
  hasErrors: computed('errors', function () {
    return Object.keys(this.get('errors')).length !== 0;
  }),
  sortedErrors: computed('errors', function () {
    let sortedErrors = [];
    const errors = this.get('errors');
    let sorter;

    if (this.get('validation.orders')) {
      sorter = this.get('validation.orders');
    } else {
      sorter = Object.keys(errors);
    }

    sorter.forEach(key => {
      if (key in errors) {
        sortedErrors.push([key, errors[key]]);
      }
    });
    return sortedErrors;
  })
});
