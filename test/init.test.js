/* --------------------
 * @overlook/route module
 * Tests
 * `.init()` prototype method
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{INIT_ROUTE, INIT_CHILDREN} = Route;

// Init
require('./support/index.js');

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

	it('calls `[INIT_ROUTE]()` with value passed to `.init()`', () => {
		route[INIT_ROUTE] = spy();
		const app = {};
		route.init(app);
		expect(route[INIT_ROUTE]).toHaveBeenCalledTimes(1);
		expect(route[INIT_ROUTE]).toHaveBeenCalledWith(app);
	});

	it('calls `[INIT_CHILDREN]()` with value passed to `.init()`', () => {
		route[INIT_CHILDREN] = spy();
		const app = {};
		route.init(app);
		expect(route[INIT_CHILDREN]).toHaveBeenCalledTimes(1);
		expect(route[INIT_CHILDREN]).toHaveBeenCalledWith(app);
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

	describe('tags error thrown in `[INIT_ROUTE]()` with router path in', () => {
		it('root route', () => {
			route[INIT_ROUTE] = () => { throw new Error('xyz'); };
			expect(
				() => route.init()
			).toThrowWithMessage(Error, 'xyz (router path /)');
		});

		it('child route', () => {
			const child = new Route({name: 'abc'});
			route.attachChild(child);
			child[INIT_ROUTE] = () => { throw new Error('xyz'); };
			expect(
				() => route.init()
			).toThrowWithMessage(Error, 'xyz (router path /abc)');
		});
	});

	describe('tags error thrown in `[INIT_CHILDREN]()` with router path in', () => {
		it('root route', () => {
			route[INIT_CHILDREN] = () => { throw new Error('xyz'); };
			expect(
				() => route.init()
			).toThrowWithMessage(Error, 'xyz (router path /)');
		});

		it('child route', () => {
			const child = new Route({name: 'abc'});
			route.attachChild(child);
			child[INIT_CHILDREN] = () => { throw new Error('xyz'); };
			expect(
				() => route.init()
			).toThrowWithMessage(Error, 'xyz (router path /abc)');
		});
	});
});
