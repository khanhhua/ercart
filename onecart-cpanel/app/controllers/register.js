import Controller from '@ember/controller';
import ValidatingController from '../mixins/validating-controller';

export default Controller.extend(ValidatingController, {
  validation: {
    orders: ['ownerid', 'password', 'recaptcha'],
    required: ['ownerid', 'password', 'recaptcha'],
    length: [
      ['password', {min: 8, max: 16}]
    ],
    email: ['ownerid']
  },
  actions: {
    onCaptchaResolved(reCaptchaResponse) {
      Ember.set(this.model,'recaptcha', reCaptchaResponse);
    },
    onCaptchaExpired() {
      console.log('gCaptcha expired!');
      Ember.set(this.model,'recaptcha', '');
    }
  }
});
