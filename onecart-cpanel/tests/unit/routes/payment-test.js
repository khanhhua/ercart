import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | payment', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:authed.payment');
    assert.ok(route);
  });
});
