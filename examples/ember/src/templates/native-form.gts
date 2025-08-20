import { createForm, type SubmitHandler, type ValidatedHandler } from '@hokulea/ember-pahu';

import { Features } from '../components/features.gts';

export const title = 'Basic Form';
export const features = ['HTML Forms as they are used to be'];

const submitHandler: SubmitHandler = (data) => console.log('Submit Handler', data);
const validationHandler: ValidatedHandler = (event, data) =>
  console.log('Validation Handler on:', event, data);

<template>
  <h1>{{title}}</h1>

  Features:
  <Features @features={{features}} />

  {{#let (createForm submit=submitHandler validated=validationHandler) as |f|}}
    <form novalidate {{f.registerElement}}>
      <label>
        Email
        <input type="email" name="email" />
      </label>

      <label>
        Age
        <input type="number" name="age" required />
      </label>

      <fieldset>
        <legend>Favorite Pokemon</legend>
        <label><input type="radio" name="pokemon" value="Bulbasaur" required /> Bulbasaur</label>
        <label><input type="radio" name="pokemon" value="Squirtle" /> Squirtle</label>
        <label><input type="radio" name="pokemon" value="Charmander" /> Charmander</label>
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  {{/let}}
</template>
