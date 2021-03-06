/* --------------------
 * @overlook/route module
 * Tests
 * `.attachChild()` prototype method
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{INIT_ROUTE, INIT_CHILDREN, ATTACH_TO} = Route;

// Init
require('./support/index.js');

const spy = jest.fn;

// Tests

describe('.attachChild()', () => {
	let route;
	beforeEach(() => {
		route = new Route();
	});

	it('prototype method exists', () => {
		expect(route.attachChild).toBeFunction();
	});

	it('sets `.parent` on child', () => {
		const child = new Route();
		route.attachChild(child);
		expect(child.parent).toBe(route);
	});

	it('adds child to `.children` on parent', () => {
		const child = new Route();
		route.attachChild(child);
		expect(route.children).toIncludeSameMembers([child]);
	});

	it('calls `child[ATTACH_TO]()` with parent', () => {
		const child = new Route();
		child[ATTACH_TO] = spy();
		route.attachChild(child);
		expect(child[ATTACH_TO]).toHaveBeenCalledTimes(1);
		expect(child[ATTACH_TO]).toHaveBeenCalledWith(route);
	});

	describe('throws if passed', () => {
		it('object', () => {
			expect(() => route.attachChild({})).toThrowWithMessage(
				Error,
				'attachChild must be called with an instance of Route class - received [object Object] (router path /)'
			);
		});

		it('Route class', () => { // eslint-disable-line jest/lowercase-name
			expect(() => route.attachChild(Route)).toThrow(
				/^attachChild must be called with an instance of Route class - received [\s\S]* \(router path \/\)$/
			);
		});

		it('null', () => {
			expect(() => route.attachChild(null)).toThrowWithMessage(
				Error,
				'attachChild must be called with an instance of Route class - received null (router path /)'
			);
		});
	});

	it('tags error thrown in `child[ATTACH_TO]()` with child router path', () => {
		class RouteSubclass extends Route {
			[ATTACH_TO](parent) {
				super[ATTACH_TO](parent);
				throw new Error('xyz');
			}
		}
		const child = new RouteSubclass({name: 'abc'});

		expect(
			() => route.attachChild(child)
		).toThrowWithMessage(Error, 'xyz (router path /abc)');
	});

	describe('during/after initialization', () => {
		it('does not throw error if called in [INIT_ROUTE]', async () => {
			const child = new Route();
			route[INIT_ROUTE] = function() {
				this.attachChild(child);
			};
			await route.init();

			// Check child attached
			expect(child.parent).toBe(route);
		});

		it('throws error if called in `[INIT_CHILDREN]`', async () => {
			const child = new Route();
			route[INIT_CHILDREN] = function() {
				this.attachChild(child);
			};

			await expect(route.init()).rejects.toThrow(
				new Error('Cannot attach children after initialization (router path /)')
			);
		});

		it('throws error if called after parent initialized', async () => {
			await route.init();
			const child = new Route();

			expect(
				() => route.attachChild(child)
			).toThrowWithMessage(Error, 'Cannot attach children after initialization (router path /)');
		});
	});
});
