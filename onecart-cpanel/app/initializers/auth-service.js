export function initialize(application) {
  application.inject('route', 'authService', 'service:auth-service');
  application.inject('adapter', 'authService', 'service:auth-service');
}

export default {
  name: 'auth-service',
  initialize
};
