import { createForm } from '@hokulea/pahu';

import { renderFeatures } from '../-utils';

const formData = {
  email: 'hello@there',
  profile: {
    name: 'Obi Wan Kenobi',
    age: 18
  }
};

const title = 'Profile Form';
const features = ['Nested Data', 'Initial Data'];

const html = `
<h1>${title}</h1>

Features: ${renderFeatures(features)}

<form novalidate>
  <label>
    Email
    <input type="email" name="email">
  </label>

  <label>
    Name
    <input type="text" name="profile.name">
  </label>

  <label>
    Age
    <input type="number" name="profile.age">
  </label>

  <button type="submit">Submit</button>
</form>
`;

function load() {
  const form = createForm({
    data: formData,
    element: document.querySelector('form') as HTMLFormElement,
    submit: (data) => console.log('Submit Handler', data),
    validated: (event, data) => console.log('Validation Handler on:', event, data)
  });

  // email
  const emailElem = document.querySelector('[name="email"]') as HTMLInputElement;
  const email = form.createField({
    name: 'email',
    //    ^? autocomplete here
    element: emailElem
  });

  emailElem.value = email.value as string;
  emailElem.addEventListener('change', (e) => email.setValue((e.target as HTMLInputElement).value));

  // name
  const nameElem = document.querySelector('[name="profile.name"]') as HTMLInputElement;
  const name = form.createField({
    name: 'profile.name',
    //    ^? autocomplete here
    element: nameElem
  });

  nameElem.value = name.value as string;
  nameElem.addEventListener('change', (e) => name.setValue((e.target as HTMLInputElement).value));

  // age
  const ageElem = document.querySelector('[name="profile.age"]') as HTMLInputElement;
  const age = form.createField({
    name: 'profile.age',
    //    ^? autocomplete here
    element: ageElem
  });

  ageElem.value = age.value as string;
  ageElem.addEventListener('change', (e: Event) =>
    age.setValue((e.target as HTMLInputElement).valueAsNumber)
  );
}

export default { html, load, title, features };
