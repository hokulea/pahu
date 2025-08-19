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
</template>
