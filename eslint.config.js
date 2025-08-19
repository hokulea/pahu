import ember from '@gossi/config-eslint/ember';

export default [
  {
    ignores: ['**/dist/']
  },
  ...ember(import.meta.dirname)
];
