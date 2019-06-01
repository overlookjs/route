/* --------------------
 * @overlook/route module
 * Tests
 * `.init()` prototype method
 * ------------------*/

'use strict';

// Modules
const Route = require('../index');

// Init
require('./support');

const spy = jest.fn;

// Tests

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
