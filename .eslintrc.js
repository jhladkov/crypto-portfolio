module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    camelcase: 'off',
    'vue/multi-word-component-names': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'import/prefer-default-export': 'off',
    'global-require': 'off',
    'vue/require-default-prop': 'off',
    'prefer-destructuring': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/require-valid-default-prop': 'off',
    'no-plusplus': 'off',
  },
};
