import { uniqueId } from '@ember/helper';
import { on } from '@ember/modifier';

import { createForm, type SubmitHandler, type ValidatedHandler } from '@hokulea/ember-pahu';

import { pick } from '../-utils';
import Errors from '../components/errors.gts';
import { Features } from '../components/features.gts';

export const title = 'Basic Form w/ Fields';
export const features = ['Manual Field registration', 'Access to Field API'];

const submitHandler: SubmitHandler = (data) => console.log('Submit Handler', data);
const validationHandler: ValidatedHandler = (event, data) =>
  console.log('Validation Handler on:', event, data);

<template>
  <h1>{{title}}</h1>

  Features:
  <Features @features={{features}} />

  {{#let (createForm submit=submitHandler validated=validationHandler) as |f|}}
    <form novalidate {{f.registerElement}}>
      {{#let (f.createField name="email") (uniqueId) as |fd errorId|}}
        <label>
          Email
          <input
            type="email"
            name="email"
            aria-errormessage={{if fd.issues errorId}}
            {{fd.registerElement}}
            {{on "change" (pick "target.value" fd.setValue)}}
          />
        </label>

        {{#if fd.issues}}
          <Errors @id={{errorId}} @errors={{fd.issues}} />
        {{/if}}
      {{/let}}

      {{#let (f.createField name="age") (uniqueId) as |fd errorId|}}
        <label>
          Age
          <input
            type="number"
            name="age"
            required
            {{fd.registerElement}}
            {{on "change" (pick "target.valueAsNumber" fd.setValue)}}
          />
        </label>

        {{#if fd.issues}}
          <Errors @id={{errorId}} @errors={{fd.issues}} />
        {{/if}}
      {{/let}}

      {{#let (f.createField name="pokemon") (uniqueId) as |fd errorId|}}
        <fieldset>
          <legend>Favorite Pokemon</legend>
          <label>
            <input
              type="radio"
              name="pokemon"
              value="Bulbasaur"
              required
              {{fd.registerElement}}
              {{on "change" (pick "target.value" fd.setValue)}}
            />
            Bulbasaur
          </label>
          <label>
            <input
              type="radio"
              name="pokemon"
              value="Squirtle"
              {{fd.registerElement}}
              {{on "change" (pick "target.value" fd.setValue)}}
            />
            Squirtle
          </label>
          <label>
            <input
              type="radio"
              name="pokemon"
              value="Charmander"
              {{fd.registerElement}}
              {{on "change" (pick "target.value" fd.setValue)}}
            />
            Charmander
          </label>

          {{#if fd.issues}}
            <Errors @id={{errorId}} @errors={{fd.issues}} />
          {{/if}}
        </fieldset>
      {{/let}}

      <button type="submit">Submit</button>
    </form>
  {{/let}}
</template>
