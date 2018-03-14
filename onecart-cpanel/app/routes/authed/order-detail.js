import Route from '@ember/routing/route';
import AuthenticatedRoute from '../../mixins/authenticated-route';

export default Route.extend(AuthenticatedRoute, {
  model(params) {
    const id = params.id;

    return this.get('store').find('order', id);
  }
});
