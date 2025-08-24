import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { click, fillIn, render, rerender } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { getProperty } from 'dot-prop';

import { createForm } from '#src';

export function pick<V = unknown>(path: string, action?: (value: V) => void) {
  return function (event: object): V | void {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const value = getProperty(event, path) as V;

    if (!action) {
      return value;
    }

    action(value);
  };
}

module('Reactivity', (hooks) => {
  setupRenderingTest(hooks);

  test('value is reactive', async (assert) => {
    await render(
      <template>
        {{#let (createForm) as |f|}}
          <form novalidate {{f.registerElement}}>
            {{#let (f.createField name="givenName") as |fd|}}
              <input
                type="text"
                {{fd.registerElement}}
                name={{fd.name}}
                {{on "change" (pick "target.value" fd.setValue)}}
              />
              <output>{{fd.value}}</output>
            {{/let}}

            <button type="submit">Let's go</button>
          </form>
        {{/let}}
      </template>
    );

    assert.dom('output').hasNoValue();

    await fillIn('input[type="text"]', 'Luke');

    assert.dom('output').hasValue('Luke');
  });

  test('issues are reactive', async (assert) => {
    await render(
      <template>
        {{#let (createForm) as |f|}}
          <form novalidate {{f.registerElement}}>
            {{#let (f.createField name="givenName") as |fd|}}
              <input
                type="text"
                {{fd.registerElement}}
                name={{fd.name}}
                {{on "change" (pick "target.value" fd.setValue)}}
                required
              />
              {{#if fd.issues}}
                <ul>
                  {{#each fd.issues as |issue|}}
                    <li>{{issue.message}}</li>
                  {{/each}}
                </ul>
              {{/if}}
            {{/let}}

            <button type="submit">Let's go</button>
          </form>
        {{/let}}
      </template>
    );

    assert.dom('ul').doesNotExist();

    await click('button');

    assert.dom('ul').exists();
    assert.dom('li').exists({ count: 1 });
  });

  test('form.invalid is reactive', async (assert) => {
    await render(
      <template>
        {{#let (createForm) as |f|}}
          <form novalidate {{f.registerElement}}>
            {{#let (f.createField name="givenName") as |fd|}}
              <input
                type="text"
                {{fd.registerElement}}
                name={{fd.name}}
                {{on "change" (pick "target.value" fd.setValue)}}
                required
              />
            {{/let}}

            <button type="submit" aria-disabled={{f.invalid}}>Let's go</button>
          </form>
        {{/let}}
      </template>
    );

    assert.dom('button').doesNotHaveAria('disabled');

    await click('button');

    assert.dom('button').hasAria('disabled');
  });

  test('field.validated is reactive', async (assert) => {
    await render(
      <template>
        {{#let (createForm) as |f|}}
          <form novalidate {{f.registerElement}}>
            {{#let (f.createField name="givenName") as |fd|}}
              <input
                type="text"
                {{fd.registerElement}}
                name={{fd.name}}
                {{on "change" (pick "target.value" fd.setValue)}}
                data-validated={{fd.validated}}
                required
              />
            {{/let}}

            <button type="submit" aria-disabled={{f.invalid}}>Let's go</button>
          </form>
        {{/let}}
      </template>
    );

    assert.dom('input[type="text"]').doesNotHaveAttribute('data-validated');

    await click('button');

    // eslint-disable-next-line unicorn/prefer-dom-node-dataset
    assert.dom('input[type="text"]').hasAttribute('data-validated');
  });

  test('form controls are reactive to updating data properties', async function (assert) {
    class Context {
      @tracked data = {
        givenName: 'Tony',
        familyName: 'Ward'
      };
    }

    const context = new Context();

    await render(
      <template>
        {{#let (createForm data=context.data) as |f|}}
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

    context.data = {
      givenName: 'Luke',
      familyName: 'Skywalker'
    };
    await rerender();

    assert.dom('output[name="givenName"]').hasValue('Luke');
    assert.dom('output[name="familyName"]').hasValue('Skywalker');
  });
});
