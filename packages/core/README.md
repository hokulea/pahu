# `@hokulea/pahu`

[![Maintainability](https://qlty.sh/gh/hokulea/projects/pahu/maintainability.svg)](https://qlty.sh/gh/hokulea/projects/pahu)
[![Code Coverage](https://qlty.sh/gh/hokulea/projects/pahu/coverage.svg)](https://qlty.sh/gh/hokulea/projects/pahu)

> 🪘 The pahu is a traditional musical instrument found in Polynesia: Hawaii,
> Tahiti, Cook Islands, Samoa, and Tokelau.

`@hokulea/pahu` is an agnostic headless form.

## Features

- HTML first. Use native form features through a pleasent API
- Validation & Revalidation
- Validators: Native, Custom, Standard Schema (zod, valibot, ark type, ...)
- Nested & initial data
- Linked Fields
- Typescript support

## Installation

```sh
pnpm add @hokulea/pahu
```

## Usage

```ts
import { createForm } from '@hokulea/pahu`;

const html = `
<form novalidate>
  <label>
    Email
    <input type="email" name="email">
  </label>

  <label>
    Age
    <input type="number" name="age" required>
  </label>

  <fieldset>
    <legend>Favorite Pokemon</legend>
    <label><input type="radio" name="pokemon" value="Bulbasaur" required> Bulbasaur</label>
    <label><input type="radio" name="pokemon" value="Squirtle"> Squirtle</label>
    <label><input type="radio" name="pokemon" value="Charmander"> Charmander</label>
  </fieldset>

  <button type="submit">Submit</button>
</form>
`;

createForm({
  element: document.querySelector('form') as HTMLFormElement,
  submit: (data) => console.log('Submit Handler', data),
  validated: (event, data) => console.log('Validation Handler on:', event, data)
});
```

## Examples

- [Vanilla Examples](https://github.com/hokulea/pahu/tree/main/examples/vanilla/src/examples)
