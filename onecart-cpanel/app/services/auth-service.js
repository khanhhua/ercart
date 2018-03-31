/* global JSEncrypt:true */

import Ember from 'ember';
import Service from '@ember/service';

export default Service.extend({
  login(appid, password) {
    return Ember.$.ajax('/api/auth/public-enc-key').promise()
      .then(publicKey => {
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKey);
        const hashedPass = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
        const encPassword = encryptor.encrypt(hashedPass);

        return Ember.$.ajax('/api/auth/login', {
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            appid,
            password: encPassword.toString()
          })
        }).promise();
      })
      .then(({jwt}) => {
        return jwt;
      });
  },
  logout() {
    return new Ember.RSVP.Promise(resolve => {
      window.localStorage.removeItem('onecart-token');
      resolve();
    });
  },
  accessToken: Ember.computed(function () {
    return window.localStorage.getItem('onecart-token');
  }).volatile(),
  appid: Ember.computed(function () {
    if (!this.get('isAuthed')) {
      return null;
    }

    const [,encoded,] = this.get('accessToken').split('.');
    const {aud: appid} = JSON.parse(atob(encoded));

    return appid;
  }).volatile(),
  isAuthed: Ember.computed.bool('accessToken').volatile()
});
