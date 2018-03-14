import EmberObject from '@ember/object';
import ValidatingControllerMixin from 'onecart-cpanel/mixins/validating-controller';
import { module, test } from 'qunit';

module('Unit | Mixin | validating-controller', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ValidatingControllerObject = EmberObject.extend(ValidatingControllerMixin);
    let subject = ValidatingControllerObject.create();
    assert.ok(subject);
  });
});
