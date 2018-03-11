import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | order-detail', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:authed.order-detail');
    assert.ok(route);
  });
});
