import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | authed/discount-edit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:authed/discount-edit');
    assert.ok(route);
  });
});
