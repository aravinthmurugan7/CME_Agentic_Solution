module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports'],
	extends: [
		'eslint:recommended',
		'next',
		'next/core-web-vitals',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
	],
	rules: {
		'no-unused-vars': 'off',
		'no-console': 'warn',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'react/no-unescaped-entities': 'off',

		'react/display-name': 'off',
		'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
		'react/jsx-filename-extension': [
			'error',
			{
				extensions: ['.tsx'],
			},
		],
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				ignoreRestSiblings: true,
				args: 'after-used',
				caughtErrors: 'none',
				vars: 'all',
				argsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^ignore',
			},
		],
		'no-undef': 'error',
		'no-lone-blocks': 'error',
		'no-underscore-dangle': 'error',
		'no-throw-literal': 'error',
		'no-array-constructor': 'error',
		'no-new-object': 'error',
		'no-new-func': 'error',
		'no-new-wrappers': 'error',
		'no-new-symbol': 'error',
		'no-path-concat': 'error',
		'no-dupe-class-members': 'error',
		'no-this-before-super': 'error',
		'no-useless-rename': 'error',
		'no-unused-labels': 'error',
		'no-return-assign': 'error',
		'no-sequences': 'error',
		'no-new': 'error',
		'no-extra-bind': 'error',
		'no-duplicate-case': 'error',
		'no-duplicate-imports': 'error',
		'no-const-assign': 'error',
		'no-case-declarations': 'error',
		'no-useless-concat': 'error',
		'no-warning-comments': 'error',
		'no-alert': 'error',
		'no-process-exit': 'error',
		'no-use-before-define': 'error',
		'prefer-const': 'error',
		'prefer-destructuring': 'error',
		'prefer-template': 'error',
		'no-var': 'error',
		'no-useless-escape': 'error',
		'max-depth': ['error', 3],
		'array-callback-return': 'error',
		'no-loop-func': 'error',
		'@typescript-eslint/no-non-null-assertion': 'error',
		'@typescript-eslint/no-inferrable-types': 'error',
		'@typescript-eslint/prefer-optional-chain': 'error',
		'react-hooks/exhaustive-deps': 0,
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'max-lines-per-function': [
			'error',
			{
				max: 300,
				skipBlankLines: true,
				skipComments: true,
			},
		],
		'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],

		//#region  //*=========== Unused Import ===========
		'unused-imports/no-unused-imports': 'warn',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
		],
		//#endregion  //*======== Unused Import ===========

		//#region  //*=========== Import Sort ===========
		'simple-import-sort/exports': 'warn',
		'simple-import-sort/imports': [
			'warn',
			{
				groups: [
					// ext library & side effect imports
					['^@?\\w', '^\\u0000'],
					// {s}css files
					['^.+\\.s?css$'],
					// Lib and hooks
					['^@/lib', '^@/hooks'],
					// static data
					['^@/data'],
					// components
					['^@/components', '^@/container'],
					// zustand store
					['^@/store'],
					// Other imports
					['^@/'],
					// relative paths up until 3 level
					[
						'^\\./?$',
						'^\\.(?!/?$)',
						'^\\.\\./?$',
						'^\\.\\.(?!/?$)',
						'^\\.\\./\\.\\./?$',
						'^\\.\\./\\.\\.(?!/?$)',
						'^\\.\\./\\.\\./\\.\\./?$',
						'^\\.\\./\\.\\./\\.\\.(?!/?$)',
					],
					['^@/types'],
					// other that didnt fit in
					['^'],
				],
			},
		],
		//#endregion  //*======== Import Sort ===========
	},
	globals: {
		React: true,
		JSX: true,
	},
};
