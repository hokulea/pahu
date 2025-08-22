import { LinkTo } from '@ember/routing';

import { Features } from '../components/features.gts';
import * as basicFields from './basic-fields';
import * as nativeForm from './native-form';
import * as profileForm from './profile-form';
import * as registrationForm from './registration-form';
import * as trackedData from './tracked-data';

const examples = [
  {
    route: 'basic-fields',
    title: basicFields.title,
    features: basicFields.features
  },
  {
    route: 'native-form',
    title: nativeForm.title,
    features: nativeForm.features
  },
  {
    route: 'profile-form',
    title: profileForm.title,
    features: profileForm.features
  },
  {
    route: 'registration-form',
    title: registrationForm.title,
    features: registrationForm.features
  },
  {
    route: 'tracked-data',
    title: trackedData.title,
    features: trackedData.features
  }
];

<template>
  <h1>Examples for <code>@hokulea/pahu</code> (Ember)</h1>

  <ul>
    {{#each examples as |example|}}
      <li>
        <LinkTo @route={{example.route}}>{{example.title}}</LinkTo>
        <Features @features={{example.features}} />
      </li>
    {{/each}}
  </ul>
</template>
