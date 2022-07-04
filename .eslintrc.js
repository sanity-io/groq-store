module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'react'],
  extends: ['sanity', 'sanity/typescript', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-undef': 'off',
  },
}
