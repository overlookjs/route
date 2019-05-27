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

	describe('`.init()`', () => {
		let route;
		beforeEach(() => {
			route = new Route();
		});

		it('prototype method exists', () => {
			expect(route.init).toBeFunction();
		});

		it('returns undefined', () => {
			const ret = route.init();
			expect(ret).toBeUndefined();
		});

		it('calls `.initRoute()` with value passed to `.init()`', () => {
			route.initRoute = spy();
			const app = {};
			route.init(app);
			expect(route.initRoute).toHaveBeenCalledTimes(1);
			expect(route.initRoute).toHaveBeenCalledWith(app);
		});

		it('calls `.initChildren()` with value passed to `.init()`', () => {
			route.initChildren = spy();
			const app = {};
			route.init(app);
			expect(route.initChildren).toHaveBeenCalledTimes(1);
			expect(route.initChildren).toHaveBeenCalledWith(app);
		});

		it('calls `.init()` on children with value passed to `.init()`', () => {
			const child = new Route();
			child.init = spy();
			route.attachChild(child);

			const app = {};
			route.init(app);
			expect(child.init).toHaveBeenCalledTimes(1);
			expect(child.init).toHaveBeenCalledWith(app);
		});
	});

	describe('`.handle()`', () => {
		it('prototype method exists', () => {
			const route = new Route();
			expect(route.handle).toBeFunction();
		});

		it('returns null', () => {
			const route = new Route();
			const ret = route.handle();
			expect(ret).toBeNull();
		});
	});
});
