import { buildMacros } from '@embroider/macros/babel';

const macros = buildMacros();

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
    ...macros.babelMacros
  ],

  generatorOpts: {
    compact: false
  }
};
