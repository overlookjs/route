/* --------------------
 * @overlook/route module
 * Tests
 * `Route.extend()` static method
 * ------------------*/

'use strict';

// Modules
const Route = require('../index');

// Init
require('./support');

const spy = jest.fn;

// Tests

describe('`Route.extend()`', () => {
	it('static method exists', () => {
		expect(Route.extend).toBeFunction();
	});

	describe('calls', () => {
		it('extension function with Route', () => {
			const fn = spy(R => R);
			Route.extend(fn);
			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith(Route);
		});

		it('multiple extension functions each with previous result', () => {
			class R2 extends Route {}
			class R3 extends R2 {}

			const fn1 = spy(() => R2),
				fn2 = spy(() => R3),
				fn3 = spy(R => R);
			Route.extend(fn1, fn2, fn3);

			expect(fn1).toHaveBeenCalledTimes(1);
			expect(fn1).toHaveBeenCalledWith(Route);
			expect(fn2).toHaveBeenCalledTimes(1);
			expect(fn2).toHaveBeenCalledWith(R2);
			expect(fn3).toHaveBeenCalledTimes(1);
			expect(fn3).toHaveBeenCalledWith(R3);
		});
	});

	describe('returns result of extension function', () => {
		it('with 1 extension', () => {
			class R2 extends Route {}
			const ret = Route.extend(() => R2);
			expect(ret).toBe(R2);
		});

		it('with multiple extensions', () => {
			class R2 extends Route {}
			class R3 extends R2 {}
			const ret = Route.extend(() => R2, () => R3);
			expect(ret).toBe(R3);
		});
	});

	describe('cache', () => {
		describe('caches previous results', () => {
			it('when extending Route', () => {
				const fn = R => class extends R {};
				const res1 = Route.extend(fn);
				const res2 = Route.extend(fn);
				expect(res2).toBe(res1);
			});

			it('when extending Route subclass', () => {
				const R2 = Route.extend(R => class extends R {});
				const fn = R => class extends R {};
				const res1 = R2.extend(fn);
				const res2 = R2.extend(fn);
				expect(res2).toBe(res1);
			});
		});

		describe('does not use wrong cache', () => {
			it('when extending Route', () => {
				const R2 = Route.extend(R => class extends R {});
				const fn = R => class extends R {};
				const res1 = Route.extend(fn);
				const res2 = R2.extend(fn);
				expect(res2).not.toBe(res1);
			});

			it('when extending Route subclass', () => {
				const R2 = Route.extend(R => class extends R {});
				const R3 = R2.extend(R => class extends R {});
				const fn = R => class extends R {};
				const res1 = R2.extend(fn);
				const res2 = R3.extend(fn);
				expect(res2).not.toBe(res1);
			});
		});
	});

	describe('identifier symbol', () => {
		it('set on class', () => {
			const fn = R => class extends R {};
			const identifier = Symbol('test');
			fn.IDENTIFIER = identifier;
			const R2 = Route.extend(fn);
			expect(R2[identifier]).toBe(true);
		});

		it('set on prototype', () => {
			const fn = R => class extends R {};
			const identifier = Symbol('test');
			fn.IDENTIFIER = identifier;
			const R2 = Route.extend(fn);
			const route = new R2();
			expect(route[identifier]).toBe(true);
		});

		it('created and saved on extension if not present', () => {
			const fn = R => class extends R {};
			Route.extend(fn);
			expect(typeof fn.IDENTIFIER).toBe('symbol');
		});
	});

	describe('duplicate extensions ignored when', () => {
		it('straight after each other', () => {
			const fn = R => class extends R {};
			const identifier = Symbol('test');
			fn.IDENTIFIER = identifier;
			const R2 = Route.extend(fn);
			const R3 = R2.extend(fn);
			expect(R3).toBe(R2);
		});

		it('with intermediate different extension', () => {
			const fn = R => class extends R {};
			const identifier = Symbol('test');
			fn.IDENTIFIER = identifier;
			const fn2 = R => class extends R {};
			const identifier2 = Symbol('test2');
			fn2.IDENTIFIER = identifier2;

			const R2 = Route.extend(fn);
			const R3 = R2.extend(fn2);
			const R4 = R3.extend(fn);
			expect(R4).toBe(R3);
		});
	});
});
