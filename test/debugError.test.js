/* --------------------
 * @overlook/route module
 * Tests
 * `.debugError()` prototype method
 * ------------------*/

'use strict';

// Modules
const Route = require('../index');

// Init
require('./support');

// Tests

describe('.debugError()', () => {
	let route;
	beforeEach(() => {
		route = new Route();
	});

	it('returns Error', () => {
		const err = route.debugError('xyz');
		expect(err).toBeInstanceOf(Error);
	});

	it('error has message passed as first arg', () => {
		const err = route.debugError('xyz');
		expect(err.message.slice(0, 3)).toBe('xyz');
	});

	it('error has properties passed as 2nd arg', () => {
		const err = route.debugError('xyz', {a: 123});
		expect(err.a).toBe(123);
	});

	describe('adds path with', () => {
		describe('root', () => {
			let err;
			beforeEach(() => {
				err = route.debugError('xyz');
			});

			it('to error message', () => {
				expect(err.message).toBe('xyz (in router path /)');
			});

			it('as `.routerPath` property', () => {
				expect(err.routerPath).toBe('/');
			});
		});

		describe('1st level child', () => {
			let err;
			beforeEach(() => {
				const child = new Route({name: 'abc'});
				route.attachChild(child);
				err = child.debugError('xyz');
			});

			it('to error message', () => {
				expect(err.message).toBe('xyz (in router path /abc)');
			});

			it('as `.routerPath` property', () => {
				expect(err.routerPath).toBe('/abc');
			});
		});

		describe('2nd level child', () => {
			let err;
			beforeEach(() => {
				const child = new Route({name: 'abc'});
				route.attachChild(child);
				const child2 = new Route({name: 'def'});
				child.attachChild(child2);
				err = child2.debugError('xyz');
			});

			it('to error message', () => {
				expect(err.message).toBe('xyz (in router path /abc/def)');
			});

			it('as `.routerPath` property', () => {
				expect(err.routerPath).toBe('/abc/def');
			});
		});

		describe('child when name undefined', () => {
			let err;
			beforeEach(() => {
				const child = new Route();
				route.attachChild(child);
				err = child.debugError('xyz');
			});

			it('to error message', () => {
				expect(err.message).toBe('xyz (in router path /?)');
			});

			it('as `.routerPath` property', () => {
				expect(err.routerPath).toBe('/?');
			});
		});
	});
});
