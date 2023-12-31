module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'src/database/migrations'
  ],
  rules: {
    'indent': ['error', 4, { "ignoredNodes": ["PropertyDefinition"] }],
    'arrow-parens': ['error', 'always'],
    'semi': ['error', 'always'],
    'no-constant-condition': 'off',
    'no-empty': 'off',
    'object-shorthand': ['error'],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'max-len': ['error', { 'code': 100 }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
