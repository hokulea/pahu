import config from '@gossi/config-template-lint';

export default {
  ...config,
  rules: {
    ...config.rules,

    'no-inline-styles': 'off'
  }
};
