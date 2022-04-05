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
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'import/prefer-default-export': 'off',
    'global-require': 'off',
    'vue/require-default-prop': 'off',
  },
};
