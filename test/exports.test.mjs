/* --------------------
 * @overlook/route module
 * Tests
 * ESM export
 * ------------------*/

// Modules
import Route, * as namedExports from '@overlook/route/es';

// Imports
import itExports from './exports.js';

// Init
import './support/index.js';

// Tests

describe('ESM export', () => { // eslint-disable-line jest/lowercase-name
	it('default export is a class', () => {
		expect(Route).toBeFunction();
	});

	describe('default export has properties', () => {
		itExports(Route);
	});

	describe('named exports', () => {
		itExports(namedExports);
	});
});
