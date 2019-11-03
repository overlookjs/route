'use strict';

module.exports = {
	testEnvironment: 'node',
	setupFilesAfterEnv: ['jest-extended'],
	coverageDirectory: 'coverage',
	collectCoverageFrom: [
		'**/*.js',
		'!.**',
		'!**/.**',
		'!**/node_modules/**',
		'!test/**',
		'!jest.config.js'
	]
};
