# `@hokulea/ember-pahu`

[![Maintainability](https://qlty.sh/gh/hokulea/projects/pahu/maintainability.svg)](https://qlty.sh/gh/hokulea/projects/pahu)
[![Code Coverage](https://qlty.sh/gh/hokulea/projects/pahu/coverage.svg)](https://qlty.sh/gh/hokulea/projects/pahu)

> 🪘 The pahu is a traditional musical instrument found in Polynesia: Hawaii,
> Tahiti, Cook Islands, Samoa, and Tokelau.

`@hokulea/ember-pahu` is the Ember adapter for Hokulea headless forms.

## Features

- HTML first. Use native form features through a pleasent API
- Validation & Revalidation
- Validators: Native, Custom, Standard Schema (zod, valibot, ark type, ...)
- Nested & initial data
- Linked Fields
- Typescript support
- Component free

## Ember

Installation:

```sh
pnpm add @hokulea/ember-pahu ember-modifier ember-resources
```

Usage:

```glimmer-ts
import { createForm } from '@hokulea/pahu/ember';

const submitHandler: SubmitHandler = (data) => console.log('Submit Handler', data);
const validationHandler: ValidatedHandler = (event, data) =>
  console.log('Validation Handler on:', event, data);

<template>
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
```

See:

- [Ember Examples](../../examples/ember/templates/)
