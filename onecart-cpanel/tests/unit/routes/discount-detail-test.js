import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | discount-detail', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:authed.discount-detail');
    assert.ok(route);
  });
});
