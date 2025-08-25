import { click, render, setupOnerror } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import sinon from 'sinon';

import { createForm } from '#src';

module('createForm', (hooks) => {
  setupRenderingTest(hooks);

  test('works with plain form', async (assert) => {
    const submitHandler = sinon.spy();

    await render(
      <template>
        {{#let (createForm submit=submitHandler) as |f|}}
          <form novalidate {{f.registerElement}}>
            <input type="text" name="givenName" value="Luke" />
            <input type="text" name="familyName" value="Skywalker" />
            <input type="number" name="age" value="19" />

            <button type="submit">Let's go</button>
          </form>
        {{/let}}
      </template>
    );

    await click('button');

    assert.ok(submitHandler.calledWith({ givenName: 'Luke', familyName: 'Skywalker', age: '19' }));
  });

  // see comment in `form.createField` for why this is skipped
  test.skip('use distinct field names', async function (assert) {
    setupOnerror((e: Error) => {
      assert.strictEqual(
        e.message,
        `Cannot register Field. Field with name 'givenName' already exists`,
        'Expected assertion error message'
      );
    });

    await render(
      <template>
        {{#let (createForm) as |f|}}
          <form novalidate {{f.registerElement}}>
            {{#let (f.createField name="givenName") as |fd|}}
              <output name="givenName">{{fd.value}}</output>
            {{/let}}

            {{#let (f.createField name="givenName") as |fd|}}
              <output name="familyName">{{fd.value}}</output>
            {{/let}}

            <button type="submit">Submit</button>
          </form>
        {{/let}}
      </template>
    );
  });
});
