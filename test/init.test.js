/* --------------------
 * @overlook/route module
 * Tests
 * `.init()` prototype method
 * ------------------*/

'use strict';

// Modules
const isPromise = require('is-promise'),
	Route = require('@overlook/route'),
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

	it('returns promise', async () => {
		const promise = route.init();
		expect(isPromise(promise)).toBeTrue();
		await promise;
	});

	it('returned promise resolves to undefined', async () => {
		const ret = await route.init();
		expect(ret).toBeUndefined();
	});

	it('calls `[INIT_ROUTE]()`', async () => {
		route[INIT_ROUTE] = spy();
		await route.init();
		expect(route[INIT_ROUTE]).toHaveBeenCalledTimes(1);
	});

	it('calls `[INIT_CHILDREN]()`', async () => {
		route[INIT_CHILDREN] = spy();
		await route.init();
		expect(route[INIT_CHILDREN]).toHaveBeenCalledTimes(1);
	});

	it('calls `.init()` on children', async () => {
		const child = new Route();
		child.init = spy();
		route.attachChild(child);

		await route.init();
		expect(child.init).toHaveBeenCalledTimes(1);
	});

	it('sets `.root` as self on root', async () => {
		await route.init();
		expect(route.root).toBe(route);
	});

	it('sets `.root` to root on child', async () => {
		const child = new Route();
		route.attachChild(child);
		await route.init();
		expect(child.root).toBe(route);
	});

	describe('tags error thrown in `[INIT_ROUTE]()` with router path in', () => {
		it('root route', async () => {
			route[INIT_ROUTE] = () => { throw new Error('xyz'); };
			await expect(route.init()).rejects.toThrow(new Error('xyz (router path /)'));
		});

		it('child route', async () => {
			const child = new Route({name: 'abc'});
			route.attachChild(child);
			child[INIT_ROUTE] = () => { throw new Error('xyz'); };
			await expect(route.init()).rejects.toThrow(new Error('xyz (router path /abc)'));
		});
	});

	describe('tags error thrown in `[INIT_CHILDREN]()` with router path in', () => {
		it('root route', async () => {
			route[INIT_CHILDREN] = () => { throw new Error('xyz'); };
			await expect(route.init()).rejects.toThrow(new Error('xyz (router path /)'));
		});

		it('child route', async () => {
			const child = new Route({name: 'abc'});
			route.attachChild(child);
			child[INIT_CHILDREN] = () => { throw new Error('xyz'); };
			await expect(route.init()).rejects.toThrow(new Error('xyz (router path /abc)'));
		});
	});
});
