import { tracked } from '@glimmer/tracking';
import { render, rerender } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { createForm } from '#src';

module('Reactivity', (hooks) => {
  setupRenderingTest(hooks);

  test('form controls are reactive to updating data properties', async function (assert) {
    class DummyData {
      @tracked givenName = 'Tony';
      @tracked familyName = 'Ward';
    }

    const data = new DummyData();

    await render(
      <template>
        {{#let (createForm data=data) as |f|}}
          <form novalidate {{f.registerElement}}>
            {{#let (f.createField name="givenName") as |fd|}}
              <output name="givenName">{{fd.value}}</output>
            {{/let}}

            {{#let (f.createField name="familyName") as |fd|}}
              <output name="familyName">{{fd.value}}</output>
            {{/let}}

            <button type="submit">Submit</button>
          </form>
        {{/let}}
      </template>
    );

    assert.dom('output[name="givenName"]').hasValue('Tony');
    assert.dom('output[name="familyName"]').hasValue('Ward');

    data.givenName = 'Luke';
    data.familyName = 'Skywalker';

    await rerender();

    assert.dom('output[name="givenName"]').hasValue('Luke');
    assert.dom('output[name="familyName"]').hasValue('Skywalker');
  });
});
