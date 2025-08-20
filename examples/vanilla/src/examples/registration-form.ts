import * as v from 'valibot';

import { createForm } from '@hokulea/pahu';

import { renderFeatures } from '../-utils';

const passwordSchema = v.pipe(
  v.optional(v.string(), ''),
  v.string(),
  v.minLength(8, 'Password must be at least 8 characters long.'),
  v.regex(/[A-Z]/, 'At least one uppercase letter required.'),
  v.regex(/[a-z]/, 'At least one lowercase letter required.'),
  v.regex(/[0-9]/, 'At least one number required.'),
  v.regex(/[^A-Za-z0-9]/, 'At least one special character required.')
);

const title = 'Registration Form';
const features = ['Linked Fields', 'Validation Mode', 'Schema Validation'];

const html = `
<h1>${title}</h1>

Features: ${renderFeatures(features)}

<form novalidate>
  <label>
    Email
    <input type="email" name="email" required>
  </label>

  <label>
    Password
    <input type="password" name="password" required>
  </label>

  <label>
    Confirm Password
    <input type="password" name="confirm_password" required>
  </label>

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

  // password
  const passwordElem = document.querySelector('[name="password"]') as HTMLInputElement;
  const password = form.createField({
    name: 'password',
    element: passwordElem,
    validateOn: 'input',
    revalidateOn: 'input',
    validate: passwordSchema
  });

  // set the value, pahu cannot detect which type you want the value in
  passwordElem.addEventListener('input', (e) =>
    password.setValue((e.target as HTMLInputElement).value)
  );

  // password
  const passwordConfirmElem = document.querySelector(
    '[name="confirm_password"]'
  ) as HTMLInputElement;
  const passwordConfirm = form.createField({
    name: 'confirm_password',
    element: passwordConfirmElem,
    linkedField: 'password',
    // eslint-disable-next-line @typescript-eslint/no-shadow
    validate: ({ value, form }) =>
      value === form.getFieldValue('password') ? undefined : 'Passwords must match'
  });

  // set the value, pahu cannot detect which type you want the value in
  passwordConfirmElem.addEventListener('change', (e) =>
    passwordConfirm.setValue((e.target as HTMLInputElement).value)
  );
}

export default { html, title, features, load };
