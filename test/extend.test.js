/* --------------------
 * @overlook/route module
 * Tests
 * `Route.extend()` static method
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	Route = require('@overlook/route');

// Init
require('./support/index.js');

const spy = jest.fn;

// Tests

describe('`Route.extend()`', () => {
	it('static method exists', () => {
		expect(Route.extend).toBeFunction();
	});

	it('calls extend function with Route and plugin', () => {
		const extend = spy(R => R),
			plugin = new Plugin(extend);
		Route.extend(plugin);
		expect(extend).toHaveBeenCalledTimes(1);
		expect(extend).toHaveBeenCalledWith(Route, plugin);
	});

	it('returns result of extend function', () => {
		class R2 extends Route {}
		const plugin = new Plugin(() => R2);
		const res = Route.extend(plugin);
		expect(res).toBe(R2);
	});

	it("applies plugin's dependent plugins", () => {
		const plugin1 = new Plugin(R => class extends R {method1() { this.prop1 = 123; }});
		const plugin2 = new Plugin([plugin1], R => class extends R {method2() { this.prop2 = 456; }});
		const R = Route.extend(plugin2);
		const route = new R();
		route.method1();
		route.method2();
		expect(route.prop1).toBe(123);
		expect(route.prop2).toBe(456);
	});

	it('throws if not passed valid plugin', () => {
		expect(() => {
			Route.extend({name: 'foo', version: '1.0.0', extend: R => R});
		}).toThrowWithMessage(TypeError, 'Plugin must be created with @overlook/plugin');
	});

	describe('cache', () => {
		describe('caches previous results', () => {
			it('when extending Route', () => {
				const plugin = new Plugin(R => class extends R {});
				const res1 = Route.extend(plugin);
				const res2 = Route.extend(plugin);
				expect(res2).toBe(res1);
			});

			it('when extending Route subclass', () => {
				const R2 = Route.extend(new Plugin(R => class extends R {}));
				const plugin = new Plugin(R => class extends R {});
				const res1 = R2.extend(plugin);
				const res2 = R2.extend(plugin);
				expect(res2).toBe(res1);
			});
		});

		describe('does not use wrong cache', () => {
			it('when extending Route', () => {
				const R2 = Route.extend(new Plugin(R => class extends R {}));
				const plugin = new Plugin(R => class extends R {});
				const res1 = Route.extend(plugin);
				const res2 = R2.extend(plugin);
				expect(res2).not.toBe(res1);
			});

			it('when extending Route subclass', () => {
				const R2 = Route.extend(new Plugin(R => class extends R {}));
				const R3 = R2.extend(new Plugin(R => class extends R {}));
				const plugin = new Plugin(R => class extends R {});
				const res1 = R2.extend(plugin);
				const res2 = R3.extend(plugin);
				expect(res2).not.toBe(res1);
			});
		});
	});

	describe('duplicate extensions ignored when', () => {
		it('straight after each other', () => {
			const plugin = new Plugin(R => class extends R {});
			const R2 = Route.extend(plugin);
			const R3 = R2.extend(plugin);
			expect(R3).toBe(R2);
		});

		it('with intermediate different extension', () => {
			const plugin = new Plugin(R => class extends R {});
			const plugin2 = new Plugin(R => class extends R {});

			const R2 = Route.extend(plugin);
			const R3 = R2.extend(plugin2);
			const R4 = R3.extend(plugin);
			expect(R4).toBe(R3);
		});
	});
});
