/* --------------------
 * @overlook/route module
 * Tests
 * `Route` class
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{ROUTE_VERSION, INIT_PROPS} = Route;

// Init
require('./support/index.js');

const spy = jest.fn;

// Tests

describe('Route class', () => { // eslint-disable-line jest/lowercase-name
	it('is a class', () => {
		expect(Route).toBeFunction();
	});

	describe('exports symbols', () => {
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

	it('has version symbol', () => {
		expect(Route[ROUTE_VERSION]).toBeString();
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

		it('initializes undefined root', () => {
			const route = new Route();
			expect(route).toHaveProperty('root');
			expect(route.root).toBeUndefined();
		});

		it('calls `[INIT_PROPS]()` with props', () => {
			class R2 extends Route {}
			const props = {};
			R2.prototype[INIT_PROPS] = spy(() => props);
			const route = new R2(props);

			expect(route[INIT_PROPS]).toHaveBeenCalledTimes(1);
			expect(route[INIT_PROPS]).toHaveBeenCalledWith(props);
		});

		it('adds passed properties to route', () => {
			const props = {a: {}};
			const route = new Route(props);
			expect(route.a).toBe(props.a);
		});
	});
});
