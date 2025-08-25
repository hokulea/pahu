import { buildMacros } from '@embroider/macros/babel';

const macros = buildMacros();

import { fileURLToPath } from 'node:url';

// For scenario testing
// const compatBuild = Boolean(process.env.ENABLE_COMPAT_BUILD);

export default {
  plugins: [
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true
      }
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        transforms: [...macros.templateMacros]
      }
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: fileURLToPath(import.meta.resolve('decorator-transforms/runtime-esm'))
        }
      }
    ],
    ...macros.babelMacros
  ],

  generatorOpts: {
    compact: false
  }
};
