module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'vue/require-default-prop': 'off',

    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off'
  },
  overrides: [
    {
      files: '**/*.js',
      rules: {
        'no-var-requires': 'off'
      }
    },
    {
      files: '**/*.ts',
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error']
      }
    }
  ]
};
