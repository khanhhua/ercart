'use strict';

define('onecart-cpanel/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'adapters/application.js should pass ESLint\n\n6:12 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n6:64 - \'name\' is defined but never used. (no-unused-vars)\n7:25 - Use import { get } from \'@ember/object\'; instead of using Ember.get (ember/new-module-imports)');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/authed/discount-create.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/authed/discount-create.js should pass ESLint\n\n5:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('controllers/authed/discount-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/authed/discount-edit.js should pass ESLint\n\n5:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('controllers/authed/payment.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/authed/payment.js should pass ESLint\n\n17:5 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)\n25:11 - Unexpected console statement. (no-console)');
  });

  QUnit.test('controllers/authed/product-create.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/authed/product-create.js should pass ESLint\n\n5:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('controllers/authed/product-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/authed/product-edit.js should pass ESLint\n\n5:3 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('initializers/auth-service.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/auth-service.js should pass ESLint\n\n');
  });

  QUnit.test('mixins/authenticated-route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/authenticated-route.js should pass ESLint\n\n');
  });

  QUnit.test('mixins/validating-controller.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'mixins/validating-controller.js should pass ESLint\n\n11:12 - Use import { get } from \'@ember/object\'; instead of using Ember.get (ember/new-module-imports)');
  });

  QUnit.test('models/discount.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/discount.js should pass ESLint\n\n');
  });

  QUnit.test('models/order.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/order.js should pass ESLint\n\n');
  });

  QUnit.test('models/product.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/product.js should pass ESLint\n\n');
  });

  QUnit.test('models/setting.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'models/setting.js should pass ESLint\n\n4:9 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n4:9 - \'Ember\' is not defined. (no-undef)\n5:5 - Unexpected \'debugger\' statement. (no-debugger)');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });

  QUnit.test('routes/authed.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/authed.js should pass ESLint\n\n5:5 - Unexpected console statement. (no-console)');
  });

  QUnit.test('routes/authed/discount-create.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/authed/discount-create.js should pass ESLint\n\n');
  });

  QUnit.test('routes/authed/discount-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/authed/discount-detail.js should pass ESLint\n\n12:7 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)');
  });

  QUnit.test('routes/authed/discount-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/authed/discount-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/authed/discounts.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/authed/discounts.js should pass ESLint\n\n');
  });

  QUnit.test('routes/authed/order-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/authed/order-detail.js should pass ESLint\n\n');
  });

  QUnit.test('routes/authed/orders.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/authed/orders.js should pass ESLint\n\n');
  });

  QUnit.test('routes/authed/payment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/authed/payment.js should pass ESLint\n\n');
  });

  QUnit.test('routes/authed/product-create.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/authed/product-create.js should pass ESLint\n\n');
  });

  QUnit.test('routes/authed/product-edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/authed/product-edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/authed/products.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/authed/products.js should pass ESLint\n\n');
  });

  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/login.js should pass ESLint\n\n1:8 - \'Ember\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('services/auth-service.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/auth-service.js should pass ESLint\n\n8:12 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)\n12:28 - \'CryptoJS\' is not defined. (no-undef)\n12:61 - \'CryptoJS\' is not defined. (no-undef)\n15:16 - Use import $ from \'jquery\'; instead of using Ember.$ (ember/new-module-imports)\n29:16 - Use import { Promise } from \'rsvp\'; instead of using Ember.RSVP.Promise (ember/new-module-imports)\n34:16 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n37:10 - Use import { computed } from \'@ember/object\'; instead of using Ember.computed (ember/new-module-imports)\n47:13 - Use import { bool } from \'@ember/object/computed\'; instead of using Ember.computed.bool (ember/new-module-imports)');
  });

  QUnit.test('transforms/isodate.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/isodate.js should pass ESLint\n\n');
  });
});
define('onecart-cpanel/tests/test-helper', ['onecart-cpanel/app', 'onecart-cpanel/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('onecart-cpanel/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/adapters/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/authed/discount-create-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/authed/discount-create-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/authed/discount-edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/authed/discount-edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/authed/payment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/authed/payment-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/authed/product-create-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/authed/product-create-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/authed/product-edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/authed/product-edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/initializers/auth-service-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/auth-service-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/authenticated-route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/authenticated-route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/validating-controller-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/validating-controller-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/discount-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/discount-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/order-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/order-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/product-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/product-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/setting-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/setting-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/authed-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/authed-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/authed/discount-edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/authed/discount-edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/authed/product-edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/authed/product-edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/discount-create-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/discount-create-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/discount-detail-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/discount-detail-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/discounts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/discounts-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/order-detail-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/order-detail-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/orders-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/orders-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/payment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/payment-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/product-create-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/product-create-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/products-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/products-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/auth-service-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/auth-service-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/transforms/isodate-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/transforms/isodate-test.js should pass ESLint\n\n');
  });
});
define('onecart-cpanel/tests/unit/adapters/application-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Adapter | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let adapter = this.owner.lookup('adapter:application');
      assert.ok(adapter);
    });
  });
});
define('onecart-cpanel/tests/unit/controllers/authed/discount-create-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | authed/discount-create', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:authed/discount-create');
      assert.ok(controller);
    });
  });
});
define('onecart-cpanel/tests/unit/controllers/authed/discount-edit-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | authed/discount-edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:authed/discount-edit');
      assert.ok(controller);
    });
  });
});
define('onecart-cpanel/tests/unit/controllers/authed/payment-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | authed/payment', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:authed/payment');
      assert.ok(controller);
    });
  });
});
define('onecart-cpanel/tests/unit/controllers/authed/product-create-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | authed/product-create', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:authed/product-create');
      assert.ok(controller);
    });
  });
});
define('onecart-cpanel/tests/unit/controllers/authed/product-edit-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Controller | authed/product-edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:authed/product-edit');
      assert.ok(controller);
    });
  });
});
define('onecart-cpanel/tests/unit/initializers/auth-service-test', ['onecart-cpanel/initializers/auth-service', 'qunit', 'ember-qunit', 'onecart-cpanel/tests/helpers/destroy-app'], function (_authService, _qunit, _emberQunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Initializer | auth-service', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    hooks.beforeEach(function () {
      this.TestApplication = Ember.Application.extend();
      this.TestApplication.initializer({
        name: 'initializer under test',
        initialize: _authService.initialize
      });

      this.application = this.TestApplication.create({ autoboot: false });
    });

    hooks.afterEach(function () {
      (0, _destroyApp.default)(this.application);
    });

    // Replace this with your real tests.
    (0, _qunit.test)('it works', async function (assert) {
      await this.application.boot();

      assert.ok(true);
    });
  });
});
define('onecart-cpanel/tests/unit/mixins/authenticated-route-test', ['onecart-cpanel/mixins/authenticated-route', 'qunit'], function (_authenticatedRoute, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | AuthenticatedRoute', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let AuthenticatedRouteObject = Ember.Object.extend(_authenticatedRoute.default);
      let subject = AuthenticatedRouteObject.create();
      assert.ok(subject);
    });
  });
});
define('onecart-cpanel/tests/unit/mixins/validating-controller-test', ['onecart-cpanel/mixins/validating-controller', 'qunit'], function (_validatingController, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | validating-controller', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let ValidatingControllerObject = Ember.Object.extend(_validatingController.default);
      let subject = ValidatingControllerObject.create();
      assert.ok(subject);
    });
  });
});
define('onecart-cpanel/tests/unit/models/discount-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | discount', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let model = Ember.run(() => store.createRecord('discount', {}));
      assert.ok(model);
    });
  });
});
define('onecart-cpanel/tests/unit/models/order-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | order', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let model = Ember.run(() => store.createRecord('order', {}));
      assert.ok(model);
    });
  });
});
define('onecart-cpanel/tests/unit/models/product-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | product', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let model = Ember.run(() => store.createRecord('product', {}));
      assert.ok(model);
    });
  });
});
define('onecart-cpanel/tests/unit/models/setting-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | setting', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let store = this.owner.lookup('service:store');
      let model = Ember.run(() => store.createRecord('setting', {}));
      assert.ok(model);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/application-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:application');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/authed-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | authed', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/authed/discount-edit-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | authed/discount-edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed/discount-edit');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/authed/product-edit-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | authed/product-edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed/product-edit');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/discount-create-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | discount-create', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed.discount-create');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/discount-detail-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | discount-detail', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed.discount-detail');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/discounts-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | discounts', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed.discounts');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/login-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | login', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:login');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/order-detail-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | order-detail', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed.order-detail');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/orders-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | orders', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed.orders');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/payment-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | payment', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed.payment');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/product-create-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | product-create', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed.product-create');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/routes/products-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | products', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:authed.products');
      assert.ok(route);
    });
  });
});
define('onecart-cpanel/tests/unit/services/auth-service-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | AuthService', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:auth-service');
      assert.ok(service);
    });
  });
});
define('onecart-cpanel/tests/unit/transforms/isodate-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('transform:isodate', 'Unit | Transform | isodate', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let transform = this.owner.lookup('transform:isodate');
      assert.ok(transform);
    });
  });
});
define('onecart-cpanel/config/environment', [], function() {
  var prefix = 'onecart-cpanel';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('onecart-cpanel/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
