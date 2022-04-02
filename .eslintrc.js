// jsファイルまたはtsファイルの文法チェック
//true・・tsファイル
//false・・jsファイル
const useTypeScript = false;

const lintEs = {
  env: {
    'browser': true,
    'jquery': true,
    'node': true,
    'es6': true,
    'es2022': true,
  },
  globals: {
    "jQuery": "readonly",//読み取り専用
    "$": "readonly",//読み取り専用
    "dataLayer": false
  },
  parserOptions: {
    "parser": "@babel/eslint-parser",
    "requireConfigFile": false,
    'sourceType': 'module',
    'ecmaVersion': 2015,
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": [
    "prettier"
  ],
  rules: {
    "semi": [
      "error",
      "always",
      {
        "omitLastInOneLineBlock": true
      }
    ],
    "prettier/prettier": "error",
    'no-extra-semi': 'warn',
    'no-undef': 'warn',
    'space-before-blocks': [
      'warn', {
        'functions': 'always'
      }
    ]
  }
};

const lintTs = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2019,
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.eslint.json'
    ]
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    "prettier/prettier": "error",
    'no-console': 'warn',
    'no-extra-semi': 'warn',
    'no-undef': 'warn',
    'quotes': [
      'warn', 'single'
    ],
    'space-before-blocks': [
      'warn', {
        'functions': 'always'
      }
    ],
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn'
  },
};

module.exports = useTypeScript ? lintTs : lintEs;
// {
//   "env": {
//     "browser": true,
//     "es2021": true
//   },
//   "plugins": ["prettier"],
//   "extends": ["eslint:recommended", "plugin:prettier/recommended"],
//   "parser": "babel-eslint",
//   "parserOptions": {
//     "sourceType": "module"
//   },
//   "globals": {
//     "jQuery": "readonly",
//     "$": "readonly",
//     "dataLayer": false
//   },
//   "rules": {
//     "prettier/prettier": "error",
//     "semi": [
//       "error",
//       "always",
//       {
//         "omitLastInOneLineBlock": true
//       }
//     ]
//   }
// }
