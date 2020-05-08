/* --------------------
 * @overlook/route module
 * Tests
 * Test function to ensure all exports present
 * ------------------*/

/* eslint-disable jest/no-export */

'use strict';

// Exports

module.exports = function itExports(Route) {
	describe('methods', () => {
		it.each([
			'isRoute',
			'isRouteClass'
		])('%s', (key) => {
			expect(Route[key]).toBeFunction();
		});
	});

	describe('symbols', () => {
		it.each([
			'ROUTE_VERSION',
			'ROUTER_PATH',
			'INIT_PROPS',
			'INIT_ROUTE',
			'INIT_CHILDREN',
			'IS_INITIALIZED',
			'ATTACH_TO',
			'DEBUG_ZONE',
			'DEBUG_ERROR'
		])('%s', (key) => {
			expect(typeof Route[key]).toBe('symbol');
		});
	});
};
