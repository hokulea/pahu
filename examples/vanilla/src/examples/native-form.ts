import { createForm } from '@hokulea/pahu';

import { renderFeatures } from '../-utils';

const title = 'Basic Form';
const features = ['HTML Forms as they are used to be'];

const html = `
<h1>${title}</h1>

Features: ${renderFeatures(features)}

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

function load() {
  createForm({
    element: document.querySelector('form') as HTMLFormElement,
    submit: (data) => console.log('Submit Handler', data),
    validated: (event, data) => console.log('Validation Handler on:', event, data)
  });
}

export default { html, load, title, features };
