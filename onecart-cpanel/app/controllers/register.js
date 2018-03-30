import Controller from '@ember/controller';
import ValidatingController from '../mixins/validating-controller';

export default Controller.extend(ValidatingController, {
  validation: {
    orders: ['ownerid', 'password'],
    required: ['ownerid', 'password'],
    length: [
      ['password', {min: 8, max: 16}]
    ],
    email: ['ownerid']
  }
});
