module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		//   TO DO Add Scope Enum Here
		// 'scope-enum': [2, 'always', ['yourscope', 'yourscope']],
		'type-enum': [
			2,
			'always',
			['feat', 'fix', 'docs', 'chore', 'style', 'refactor', 'ci', 'test', 'perf', 'revert', 'vercel'],
		],
	},
};
