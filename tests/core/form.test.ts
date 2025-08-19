import { page } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';

import { createForm } from '#src';

test('default options', () => {
  const form = createForm();

  expect(form.invalid).toBeFalsy();
  expect(form.fieldValidationEvent).toBe('off');
  expect(form.fieldRevalidationEvent).toBe('change');
  expect(form.ignoreNativeValidation).toBeFalsy();
});

test('registerElement()', async () => {
  const screen = page.render('<form novalidate data-testid="f">...</form>');

  const element = screen.getByTestId('f').element() as HTMLFormElement;

  const submitHandler = vi.fn();

  createForm({ element, submit: submitHandler });

  element.dispatchEvent(new SubmitEvent('submit'));

  await vi.waitFor(() => expect(submitHandler).toHaveBeenCalled());
});

test('re-registerElement()', async () => {
  const screen = page.render(`
    <form novalidate data-testid="a"></form>
    <form novalidate data-testid="b"></form>
  `);

  const element = screen.getByTestId('a').element() as HTMLFormElement;
  const submitHandler = vi.fn();
  const form = createForm({ element, submit: submitHandler });

  element.dispatchEvent(new SubmitEvent('submit'));

  await vi.waitFor(() => expect(submitHandler).toHaveBeenCalled());

  submitHandler.mockClear();

  form.subtle.registerElement(screen.getByTestId('b').element() as HTMLFormElement);

  element.dispatchEvent(new SubmitEvent('submit'));

  await vi.waitFor(() => expect(submitHandler).not.toHaveBeenCalled());
});

describe('Submission', () => {
  test('native form (invalid)', async () => {
    const screen = page.render(`
      <form novalidate data-testid="form">
        <input type="email" name="email">
        <input type="number" name="age" required>
      </form>
    `);

    const formElement = screen.getByTestId('form').element() as HTMLFormElement;
    const validationHandler = vi.fn();

    createForm({
      element: formElement,
      validated: validationHandler
    });

    formElement.dispatchEvent(new SubmitEvent('submit'));

    await vi.waitFor(() => {
      expect(validationHandler).toBeCalledTimes(1);
    });
  });

  test('native form (valid)', async () => {
    const screen = page.render(`
      <form novalidate data-testid="form">
        <input type="email" name="email">
        <input type="number" name="age">
      </form>
    `);

    const formElement = screen.getByTestId('form').element() as HTMLFormElement;
    const submitHandler = vi.fn();

    createForm({
      element: formElement,
      submit: submitHandler
    });

    formElement.dispatchEvent(new SubmitEvent('submit'));

    await vi.waitFor(() => {
      expect(submitHandler).toBeCalledTimes(1);
    });
  });

  test('nested data', async () => {
    const formData = {
      email: 'hello@there',
      profile: {
        name: 'Obi Wan Kenobi',
        age: 18
      }
    };

    const submitHandler = vi.fn();
    const form = createForm({ data: formData, submit: submitHandler });

    form.createField({ name: 'email' });
    form.createField({ name: 'profile.name' });
    form.createField({ name: 'profile.age' });

    await form.submit();

    expect(submitHandler).toBeCalledWith(formData);
  });
});
