import EmberRouter from '@ember/routing/router';
import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { setupEmberOnerrorValidation, start as qunitStart } from 'ember-qunit';

import Application from 'ember-strict-application-resolver';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

class TestApp extends Application {
  modules = {
    './router': Router
  };
}

export function start(): void {
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing'
    })
  );

  // eslint-disable-next-line import-x/namespace
  setup(QUnit.assert);
  setupEmberOnerrorValidation();
  qunitStart();
}
