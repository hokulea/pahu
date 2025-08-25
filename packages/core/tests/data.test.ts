import { expect, test } from 'vitest';

import { createForm } from '#src';

test('Initial Data', () => {
  const formData = {
    email: 'hello@there',
    profile: {
      name: 'Obi Wan Kenobi',
      age: 18
    }
  };

  const form = createForm({ data: formData });
  const email = form.createField({
    name: 'email',
    value: 'hello@general.kenobi'
  });
  const name = form.createField({ name: 'profile.name' });
  const age = form.createField({ name: 'profile.age' });
  const planet = form.createField({ name: 'planet' });

  // test initial data being sat
  expect(email.value).toBe('hello@general.kenobi');
  expect(name.value).toBe('Obi Wan Kenobi');
  expect(age.value).toBe(18);
  expect(planet.value).toBeUndefined();
  expect(name.pristine).toBeTruthy();

  // update initial data
  form.updateConfig({
    data: {
      email: 'skyguy@does.not.like.sand',
      profile: {
        age: 10,
        name: 'Anakin Skywalker'
      }
    }
  });
  expect(email.value).toBe('hello@general.kenobi');
  expect(name.value).toBe('Anakin Skywalker');
  expect(age.value).toBe(10);
  expect(planet.value).toBeUndefined();
  expect(name.pristine).toBeTruthy();

  // set custom data to overwrite initial data
  name.setValue('Palpatine');
  expect(name.value).toBe('Palpatine');
  expect(name.pristine).toBeFalsy();
  expect(name.dirty).toBeTruthy();

  form.updateConfig({ data: formData });

  expect(email.value).toBe('hello@general.kenobi');
  expect(name.value).toBe('Palpatine');
  expect(age.value).toBe(18);
});
