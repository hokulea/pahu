import './styles/app.css';

import EmberRouter from '@ember/routing/router';

import Application from 'ember-strict-application-resolver';

class Router extends EmberRouter {
  location = 'history';
  rootURL = '/';
}

Router.map(function () {
  /* eslint-disable @typescript-eslint/no-invalid-this */
  this.route('native-form');
  this.route('basic-fields');
  this.route('profile-form');
  this.route('registration-form');
  this.route('tracked-data');
  /* eslint-enable @typescript-eslint/no-invalid-this */
});

export default class App extends Application {
  modules = {
    './router': Router,
    ...import.meta.glob('./templates/**/*', { eager: true })
  };
}
