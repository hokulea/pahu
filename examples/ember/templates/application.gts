import { LinkTo } from '@ember/routing';

<template>
  <nav>
    <LinkTo @route="application">Home</LinkTo>
    |
    <LinkTo @route="native-form">Native Form</LinkTo>
    |
    <LinkTo @route="basic-fields">Basic Fields</LinkTo>
    |
    <LinkTo @route="profile-form">Profile Form</LinkTo>
    |
    <LinkTo @route="registration-form">Registration Form</LinkTo>
  </nav>

  {{outlet}}
  {{!-- <h1>Form</h1>

  {{#let (createForm data=(hash givenName="") submit=handleSubmit) as |frm|}}
    <form {{frm.registerElement}} novalidate>

      {{#let (frm.createField name="givenName") as |f|}}
        <p>
          <label>
            Given Name
            <input {{f.registerElement}} name={{f.name}} value={{f.value}} />
          </label>
        </p>
      {{/let}}

      {{#let (frm.createField name="familyName") as |f|}}
        <p>
          <label>
            Family Name
            <input
              {{f.registerElement}}
              name={{f.name}}
              value={{f.value}}
              {{on "change" (pick "target.value" f.setValue)}}
              required
            />
            {{f.value}}
          </label>
          {{#if f.issues}}
            <ul>
              {{#each f.issues as |issue|}}
                <li>{{issue.message}}</li>
              {{/each}}
            </ul>
          {{/if}}
        </p>
      {{/let}}

      <p>
        <button type="submit">Let's go</button>
      </p>

    </form>
  {{/let}} --}}
</template>
