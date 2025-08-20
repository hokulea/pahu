import { createForm } from '@hokulea/pahu';

import { renderFeatures } from '../-utils';

const title = 'Basic Form w/ Fields';
const features = ['Manual Field registration', 'Access to Field API'];

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
  const form = createForm({
    element: document.querySelector('form') as HTMLFormElement,
    submit: (data) => console.log('Submit Handler', data),
    validated: (event, data) => console.log('Validation Handler on:', event, data)
  });

  // email
  const emailElem = document.querySelector('[name="email"]') as HTMLInputElement;
  const email = form.createField({
    name: 'email',
    element: emailElem
  });

  // set the value, pahu cannot detect which type you want the value in
  emailElem.addEventListener('change', (e) => email.setValue((e.target as HTMLInputElement).value));

  // age
  const ageElem = document.querySelector('[name="age"]') as HTMLInputElement;
  const age = form.createField({
    name: 'age',
    element: ageElem
  });

  ageElem.addEventListener('change', (e: Event) =>
    // see? here it is a number, not a string
    age.setValue((e.target as HTMLInputElement).valueAsNumber)
  );

  // pkmn
  const pkmn = form.createField({ name: 'pokemon' });

  for (const elem of document.querySelectorAll<HTMLInputElement>('[name="pokemon"]')) {
    pkmn.subtle.registerElement(elem);
    elem.addEventListener('change', (e) => pkmn.setValue((e.target as HTMLInputElement).value));
  }
}

export default { html, load, title, features };
