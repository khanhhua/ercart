import Ember from 'ember';
import Controller from '@ember/controller';

export default Controller.extend({
  isEditingPaypal: false,
  isPaypalUpdated: false,
  /**
   *
   * @param methodName Paypal for now
   */
  authorize(methodName) {
    if (methodName !== 'paypal') {
      throw new Error('NotSupported')
    }

    this.set('isEditingPaypal', true);
    Ember.$.post('/api/payment/authorize').promise().then(data => {
      const {token} = data;
      window.open(`https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_grant-permission&request_token=${token}`,
        '_blank', 'location=yes,height=570,width=820,scrollbars=yes,status=yes');

      window.addEventListener('message', (e) => {
        const payload = e.data;
        if (payload.type === 'paypal.auth.success') {
          console.log(`Saving ${payload.payer_id} as merchant payerID...`);
          this.set('isEditingPaypal', false);

          this.get('model.[]').find(it => it.id === 'payment.paypal.payer_id').set('value', payload.payer_id);
        }
      })
    })
  }
});
