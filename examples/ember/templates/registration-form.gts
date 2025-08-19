import { uniqueId } from '@ember/helper';
import { on } from '@ember/modifier';

import * as v from 'valibot';

import {
  createForm,
  type FieldValidationHandler,
  type SubmitHandler,
  type ValidatedHandler
} from '#src/ember';

import { pick } from '../-utils';
import Errors from '../components/errors.gts';
import { Features } from '../components/features.gts';

export const title = 'Registration Form';
export const features = ['Linked Fields', 'Validation Mode', 'Schema Validation'];

const submitHandler: SubmitHandler = (data) => console.log('Submit Handler', data);
const validationHandler: ValidatedHandler = (event, data) =>
  console.log('Validation Handler on:', event, data);

const validateConfirmPassword: FieldValidationHandler = ({ value, form }) =>
  value === form.getFieldValue('password') ? undefined : 'Passwords must match';

const passwordSchema = v.pipe(
  v.optional(v.string(), ''),
  v.string(),
  v.minLength(8, 'Password must be at least 8 characters long.'),
  v.regex(/[A-Z]/, 'At least one uppercase letter required.'),
  v.regex(/[a-z]/, 'At least one lowercase letter required.'),
  v.regex(/[0-9]/, 'At least one number required.'),
  v.regex(/[^A-Za-z0-9]/, 'At least one special character required.')
);

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
            required
            aria-errormessage={{if fd.issues errorId}}
            {{fd.registerElement}}
            {{on "change" (pick "target.value" fd.setValue)}}
          />
        </label>

        {{#if fd.issues}}
          <Errors @id={{errorId}} @errors={{fd.issues}} />
        {{/if}}
      {{/let}}

      {{#let
        (f.createField
          name="password" validate=passwordSchema validateOn="input" revalidateOn="input"
        )
        (uniqueId)
        as |fd errorId|
      }}
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            aria-errormessage={{if fd.issues errorId}}
            {{on "input" (pick "target.value" fd.setValue)}}
            {{fd.registerElement}}
          />
        </label>

        {{#if fd.issues}}
          <Errors @id={{errorId}} @errors={{fd.issues}} />
        {{/if}}
      {{/let}}

      {{#let
        (f.createField
          name="confirm_password" linkedField="password" validate=validateConfirmPassword
        )
        (uniqueId)
        as |fd errorId|
      }}
        <label>
          Confirm Password
          <input
            type="password"
            name="confirm_password"
            aria-errormessage={{if fd.issues errorId}}
            required
            {{fd.registerElement}}
            {{on "change" (pick "target.valueAsNumber" fd.setValue)}}
          />
        </label>

        {{#if fd.issues}}
          <Errors @id={{errorId}} @errors={{fd.issues}} />
        {{/if}}
      {{/let}}

      <button type="submit">Submit</button>
    </form>
  {{/let}}
</template>
