/* --------------------
 * @overlook/route module
 * Tests
 * `Route#attachChild()` prototype method
 * ------------------*/

'use strict';

// Modules
const Route = require('../index');

// Init
require('./support');

const spy = jest.fn;

// Tests

describe('Route#attachChild()', () => { // eslint-disable-line jest/lowercase-name
	it('prototype method exists', () => {
		const route = new Route();
		expect(route.attachChild).toBeFunction();
	});

	it('sets `.parent` on child', () => {
		const parent = new Route();
		const child = new Route();
		parent.attachChild(child);
		expect(child.parent).toBe(parent);
	});

	it('adds child to `.children` on parent', () => {
		const parent = new Route();
		const child = new Route();
		parent.attachChild(child);
		expect(parent.children).toIncludeSameMembers([child]);
	});

	it('calls `child.attachTo()` with parent', () => {
		const parent = new Route();
		const child = new Route();
		child.attachTo = spy();
		parent.attachChild(child);
		expect(child.attachTo).toHaveBeenCalledTimes(1);
		expect(child.attachTo).toHaveBeenCalledWith(parent);
	});

	describe('during/after initialization', () => {
		it('does not throw error if called in `.initRoute`', () => {
			const parent = new Route();
			const child = new Route();
			parent.initRoute = function() {
				this.attachChild(child);
			};
			parent.init();

			// Check child attached
			expect(child.parent).toBe(parent);
		});

		it('throws error if called in `.initChildren`', () => {
			const parent = new Route();
			const child = new Route();
			parent.initChildren = function() {
				this.attachChild(child);
			};

			expect(
				() => parent.init()
			).toThrowWithMessage(Error, 'Cannot attach children after initialization');
		});

		it('throws error if called after parent initialized', () => {
			const parent = new Route();
			parent.init();
			const child = new Route();

			expect(
				() => parent.attachChild(child)
			).toThrowWithMessage(Error, 'Cannot attach children after initialization');
		});
	});
});
