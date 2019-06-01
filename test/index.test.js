/* --------------------
 * @overlook/route module
 * Tests
 * `Route` class
 * ------------------*/

'use strict';

// Modules
const Route = require('../index');

// Init
require('./support');

const spy = jest.fn;

// Tests

describe('Route class', () => { // eslint-disable-line jest/lowercase-name
	it('is a class', () => {
		expect(Route).toBeFunction();
	});

	describe('constructor', () => {
		it('initializes undefined name', () => {
			const route = new Route();
			expect(route).toHaveProperty('name');
			expect(route.name).toBeUndefined();
		});

		it('initializes undefined parent', () => {
			const route = new Route();
			expect(route).toHaveProperty('parent');
			expect(route.parent).toBeUndefined();
		});

		it('initializes empty children array', () => {
			const route = new Route();
			expect(route.children).toBeArrayOfSize(0);
		});

		it('initializes undefined app', () => {
			const route = new Route();
			expect(route).toHaveProperty('app');
			expect(route.app).toBeUndefined();
		});

		it('calls `.initProps()` with props', () => {
			class R2 extends Route {}
			const props = {};
			R2.prototype.initProps = spy(() => props);
			const route = new R2(props);

			expect(route.initProps).toHaveBeenCalledTimes(1);
			expect(route.initProps).toHaveBeenCalledWith(props);
		});

		it('adds passed properties to route', () => {
			const props = {a: {}};
			const route = new Route(props);
			expect(route.a).toBe(props.a);
		});
	});
});
