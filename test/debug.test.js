/* --------------------
 * @overlook/route module
 * Tests
 * Debug methods
 * ------------------*/

'use strict';

// Modules
const Route = require('../index'),
	{ROUTER_PATH} = Route;

// Imports
const {tryCatch, rejectionReason} = require('./support/utils');

// Init
require('./support');

// Tests

describe('`.debugError()`', () => {
	let route;
	beforeEach(() => {
		route = new Route();
	});

	it('returns input if Error', () => {
		const errIn = new Error('xyz');
		const err = route.debugError(errIn);
		expect(err).toBe(errIn);
	});

	describe('wraps input if not Error', () => {
		let input, err;
		beforeEach(() => {
			input = {};
			err = route.debugError(input);
		});

		it('to Error object', () => {
			expect(err).toBeInstanceOf(Error);
		});

		it('with message including original value', () => {
			expect(err.message).toStartWith('Unknown error: [object Object]');
		});

		it('with `.parent` property containing original value', () => {
			expect(err.parent).toBe(input);
		});
	});

	it('passes through error message', () => {
		const err = route.debugError(new Error('xyz'));
		expect(err.message).toStartWith('xyz');
	});

	describe('adds path with', () => {
		describe('root', () => {
			let err;
			beforeEach(() => {
				err = route.debugError(new Error('xyz'));
			});

			it('to error message', () => {
				expect(err.message).toBe('xyz (router path /)');
			});

			it('as `[ROUTER_PATH]` property', () => {
				expect(err[ROUTER_PATH]).toBe('/');
			});
		});

		describe('1st level child', () => {
			let err;
			beforeEach(() => {
				const child = new Route({name: 'abc'});
				route.attachChild(child);
				err = child.debugError(new Error('xyz'));
			});

			it('to error message', () => {
				expect(err.message).toBe('xyz (router path /abc)');
			});

			it('as `[ROUTER_PATH]` property', () => {
				expect(err[ROUTER_PATH]).toBe('/abc');
			});
		});

		describe('2nd level child', () => {
			let err;
			beforeEach(() => {
				const child = new Route({name: 'abc'});
				route.attachChild(child);
				const child2 = new Route({name: 'def'});
				child.attachChild(child2);
				err = child2.debugError(new Error('xyz'));
			});

			it('to error message', () => {
				expect(err.message).toBe('xyz (router path /abc/def)');
			});

			it('as `[ROUTER_PATH]` property', () => {
				expect(err[ROUTER_PATH]).toBe('/abc/def');
			});
		});

		describe('child when name undefined', () => {
			let err;
			beforeEach(() => {
				const child = new Route();
				route.attachChild(child);
				err = child.debugError(new Error('xyz'));
			});

			it('to error message', () => {
				expect(err.message).toBe('xyz (router path /?)');
			});

			it('as `[ROUTER_PATH]` property', () => {
				expect(err[ROUTER_PATH]).toBe('/?');
			});
		});
	});
});

describe('`.debugZone()`', () => {
	let route;
	beforeEach(() => {
		route = new Route();
	});

	// Sync return values
	it('passes through return value unchanged', () => {
		const res = {};
		const ret = route.debugZone(() => res);
		expect(ret).toBe(res);
		expect(ret).toEqual({});
	});

	describe('catches and tags thrown error in', () => {
		it('root', () => {
			expect(() => (
				route.debugZone(() => { throw new Error('xyz'); })
			)).toThrowWithMessage(Error, 'xyz (router path /)');
		});

		it('1st level child', () => {
			const child = new Route({name: 'abc'});
			route.attachChild(child);

			expect(() => (
				child.debugZone(() => { throw new Error('xyz'); })
			)).toThrowWithMessage(Error, 'xyz (router path /abc)');
		});

		it('2nd level child', () => {
			const child = new Route({name: 'abc'});
			route.attachChild(child);
			const child2 = new Route({name: 'def'});
			child.attachChild(child2);

			expect(() => (
				child2.debugZone(() => { throw new Error('xyz'); })
			)).toThrowWithMessage(Error, 'xyz (router path /abc/def)');
		});
	});

	it('ignores errors which are already tagged', () => {
		const errIn = new Error('xyz (router path /abc)');
		errIn[ROUTER_PATH] = '/abc';

		const err = tryCatch(() => {
			route.debugZone(() => { throw errIn; });
		});

		expect(err).toBe(errIn);
		expect(err.message).toBe('xyz (router path /abc)');
		expect(err[ROUTER_PATH]).toBe('/abc');
	});

	// Promises
	it('passes through promise with resolve value unchanged', async () => {
		const res = {};
		const promise = route.debugZone(() => Promise.resolve(res));
		expect(promise).toBeInstanceOf(Promise);
		const ret = await promise;
		expect(ret).toBe(res);
		expect(ret).toEqual({});
	});

	describe('catches and tags rejected promise in', () => {
		it('root', async () => {
			const errIn = new Error('xyz');
			const promise = route.debugZone(() => Promise.reject(errIn));
			expect(promise).toBeInstanceOf(Promise);
			const err = await rejectionReason(promise);

			expect(err).toBe(errIn);
			expect(err.message).toBe('xyz (router path /)');
			expect(err[ROUTER_PATH]).toBe('/');
		});

		it('1st level child', async () => {
			const child = new Route({name: 'abc'});
			route.attachChild(child);

			const errIn = new Error('xyz');
			const promise = child.debugZone(() => Promise.reject(errIn));
			expect(promise).toBeInstanceOf(Promise);
			const err = await rejectionReason(promise);

			expect(err).toBe(errIn);
			expect(err.message).toBe('xyz (router path /abc)');
			expect(err[ROUTER_PATH]).toBe('/abc');
		});

		it('2nd level child', async () => {
			const child = new Route({name: 'abc'});
			route.attachChild(child);
			const child2 = new Route({name: 'def'});
			child.attachChild(child2);

			const errIn = new Error('xyz');
			const promise = child2.debugZone(() => Promise.reject(errIn));
			expect(promise).toBeInstanceOf(Promise);
			const err = await rejectionReason(promise);

			expect(err).toBe(errIn);
			expect(err.message).toBe('xyz (router path /abc/def)');
			expect(err[ROUTER_PATH]).toBe('/abc/def');
		});
	});

	it('ignores promise rejections which are already tagged', async () => {
		const errIn = new Error('xyz (router path /abc)');
		errIn[ROUTER_PATH] = '/abc';
		const promise = route.debugZone(() => Promise.reject(errIn));
		expect(promise).toBeInstanceOf(Promise);
		const err = await rejectionReason(promise);

		expect(err).toBe(errIn);
		expect(err.message).toBe('xyz (router path /abc)');
		expect(err[ROUTER_PATH]).toBe('/abc');
	});
});
