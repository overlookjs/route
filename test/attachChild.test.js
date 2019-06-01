/* --------------------
 * @overlook/route module
 * Tests
 * `.attachChild()` prototype method
 * ------------------*/

'use strict';

// Modules
const Route = require('../index');

// Init
require('./support');

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

	it('calls `child.attachTo()` with parent', () => {
		const child = new Route();
		child.attachTo = spy();
		route.attachChild(child);
		expect(child.attachTo).toHaveBeenCalledTimes(1);
		expect(child.attachTo).toHaveBeenCalledWith(route);
	});

	describe('during/after initialization', () => {
		it('does not throw error if called in `.initRoute`', () => {
			const child = new Route();
			route.initRoute = function() {
				this.attachChild(child);
			};
			route.init();

			// Check child attached
			expect(child.parent).toBe(route);
		});

		it('throws error if called in `.initChildren`', () => {
			const child = new Route();
			route.initChildren = function() {
				this.attachChild(child);
			};

			expect(
				() => route.init()
			).toThrowWithMessage(Error, 'Cannot attach children after initialization (router path /)');
		});

		it('throws error if called after parent initialized', () => {
			route.init();
			const child = new Route();

			expect(
				() => route.attachChild(child)
			).toThrowWithMessage(Error, 'Cannot attach children after initialization');
		});
	});
});
