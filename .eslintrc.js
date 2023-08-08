module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  extends: 'eslint:recommended',
  globals: {
    atom: true
  },
  rules: {
    "semi": ["error", "always"],
    "space-before-function-paren": ["error", "always"],
    "no-cond-assign": "off"
  }
};
