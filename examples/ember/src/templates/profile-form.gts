import { uniqueId } from '@ember/helper';
import { on } from '@ember/modifier';

import { createForm, type SubmitHandler, type ValidatedHandler } from '@hokulea/ember-pahu';

import { pick } from '../-utils';
import Errors from '../components/errors.gts';
import { Features } from '../components/features.gts';

export const title = 'Profile Form';
export const features = ['Nested Data', 'Initial Data'];

const submitHandler: SubmitHandler = (data) => console.log('Submit Handler', data);
const validationHandler: ValidatedHandler = (event, data) =>
  console.log('Validation Handler on:', event, data);

const data = {
  email: 'hello@there',
  profile: {
    name: 'Obi Wan Kenobi',
    age: 18
  }
};

<template>
  <h1>{{title}}</h1>

  Features:
  <Features @features={{features}} />

  {{#let (createForm submit=submitHandler validated=validationHandler data=data) as |f|}}
    <form novalidate {{f.registerElement}}>
      {{#let (f.createField name="email") (uniqueId) as |fd errorId|}}
        {{!                       ^ suggestions here with intelli-sense }}
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
        {{!                       ^ suggestions here with intelli-sense }}
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
        {{!                       ^ suggestions here with intelli-sense }}
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
