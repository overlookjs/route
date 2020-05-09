/* --------------------
 * @overlook/route module
 * Tests
 * `.handle()` prototype method
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route');

// Init
require('./support/index.js');

// Tests

describe('`.handle()`', () => {
	it('prototype method exists', () => {
		const route = new Route();
		expect(route.handle).toBeFunction();
	});

	it('returns undefined', () => {
		const route = new Route();
		const ret = route.handle();
		expect(ret).toBeUndefined();
	});
});
