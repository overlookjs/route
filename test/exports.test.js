/* --------------------
 * @overlook/route module
 * Tests
 * CJS export
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route');

// Imports
const itExports = require('./exports.js');

// Init
require('./support/index.js');

// Tests

describe('CJS export', () => {
	it('is a class', () => {
		expect(Route).toBeFunction();
	});

	describe('has properties', () => {
		itExports(Route);
	});
});
