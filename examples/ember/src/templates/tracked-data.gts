import { tracked } from '@glimmer/tracking';
import { uniqueId } from '@ember/helper';
import { on } from '@ember/modifier';

import { createForm, type SubmitHandler, type ValidatedHandler } from '@hokulea/ember-pahu';

import { pick } from '../-utils';
import Errors from '../components/errors.gts';
import { Features } from '../components/features.gts';

export const title = 'Tracked Data';
export const features = ['Nested Data', 'Tracked Initial Data'];

const submitHandler: SubmitHandler = (data) => console.log('Submit Handler', data);
const validationHandler: ValidatedHandler = (event, data) =>
  console.log('Validation Handler on:', event, data);

class Profile {
  @tracked name?: string;
  @tracked age?: number;
}

class Data {
  @tracked email?: string;
  @tracked profile = new Profile();
}

function makeObiWan() {
  const profile = new Profile();

  profile.age = 18;
  profile.name = 'Obi Wan Kenobi';

  const data = new Data();

  data.email = 'hello@there';
  data.profile = profile;

  return data;
}

function makeAnakin() {
  const profile = new Profile();

  profile.age = 10;
  profile.name = 'Anakin Skywalker';

  const data = new Data();

  data.email = 'skyguy@does.not.like.sand';
  data.profile = profile;

  return data;
}

class Context {
  @tracked data: Data = makeObiWan();
}

const context = new Context();

function switchToAnakin() {
  context.data = makeAnakin();
}

function switchToObiWan() {
  context.data = makeObiWan();
}

function turnPalpatine() {
  context.data.profile.name = 'Palpatine';
}

<template>
  <h1>{{title}}</h1>

  Features:
  <Features @features={{features}} />

  <button type="button" {{on "click" switchToObiWan}}>Switch to Obi Wan</button>
  <button type="button" {{on "click" switchToAnakin}}>Switch to Anakin</button>
  <button type="button" {{on "click" turnPalpatine}}>Turn Palpatine</button>

  <p>
    Profile:
    {{context.data.profile.name}}
    ({{context.data.profile.age}})
  </p>

  {{#let (createForm submit=submitHandler validated=validationHandler data=context.data) as |f|}}
    <form novalidate {{f.registerElement}}>
      {{#let (f.createField name="email") (uniqueId) as |fd errorId|}}
        <label>
          Email
          <input
            type="email"
            name="email"
            value={{fd.value}}
            aria-errormessage={{if fd.issues errorId}}
            {{fd.registerElement}}
            {{on "change" (pick "target.value" fd.setValue)}}
          />
        </label>

        {{#if fd.issues}}
          <Errors @id={{errorId}} @errors={{fd.issues}} />
        {{/if}}
      {{/let}}

      {{#let (f.createField name="profile.name") (uniqueId) as |fd errorId|}}
        <label>
          Name
          <input
            type="text"
            name="profile.name"
            value={{fd.value}}
            aria-errormessage={{if fd.issues errorId}}
            {{fd.registerElement}}
            {{on "change" (pick "target.value" fd.setValue)}}
          />
        </label>

        {{#if fd.issues}}
          <Errors @id={{errorId}} @errors={{fd.issues}} />
        {{/if}}
      {{/let}}

      {{#let (f.createField name="profile.age") (uniqueId) as |fd errorId|}}
        <label>
          Name
          <input
            type="number"
            name="profile.age"
            value={{fd.value}}
            aria-errormessage={{if fd.issues errorId}}
            required
            {{fd.registerElement}}
            {{on "change" (pick "target.valueAsNumber" fd.setValue)}}
          />
        </label>

        {{#if fd.issues}}
          <Errors @id={{errorId}} @errors={{fd.issues}} />
        {{/if}}
      {{/let}}

      <button type="submit">Submit</button>
    </form>
  {{/let}}
</template>
