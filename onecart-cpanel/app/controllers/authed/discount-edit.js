import Controller from '@ember/controller';
import ValidatingController from '../../mixins/validating-controller';

export default Controller.extend(ValidatingController, {
  validation: {
    required: ['id', 'promocode', 'expiry', 'status']
  }
});
