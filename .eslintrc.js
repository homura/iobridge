module.exports = {
  env: {
    mocha: true,
  },
  plugins: ['@typescript-eslint'],
  extends: ['standard', 'plugin:prettier/recommended', 'plugin:node/recommended'],
  parser: '@typescript-eslint/parser',
  settings: {
    node: {
      tryExtensions: ['.js', '.json', '.node', '.ts'],
    },
  },
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'node/no-extraneous-import': ['error', { allowModules: ['chai'] }],
    'node/no-unpublished-import': ['error', { allowModules: ['chai'] }],
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
  },
};
