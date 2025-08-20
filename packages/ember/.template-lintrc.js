import config from '@gossi/config-template-lint';

export default {
  ...config,
  rules: {
    ...config.rules,

    'require-input-label': 'off'
  }
};
