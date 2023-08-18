'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const config = configs.crossPlatform();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.{js,ts}'],
      rules: {
        '@typescript-eslint/prefer-optional-chain': 'off',
        // Rules incompatible with tsconfig.extends array
        'import/no-cycle': 'off',
        'import/named': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
      },
    }
  ]
}
