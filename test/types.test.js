/* --------------------
 * @overlook/route module
 * Tests
 * `.isRoute()` + `.isRouteClass()` static methods
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{isRoute, isRouteClass} = Route;

// Init
require('./support/index.js');

// Tests

describe('`.isRoute()`', () => {
	it('returns true for Route instance', () => {
		const route = new Route();
		expect(isRoute(route)).toBeTrue();
	});

	it('returns true for Route subclass instance', () => {
		class SubClass extends Route {}
		const route = new SubClass();
		expect(isRoute(route)).toBeTrue();
	});

	it('returns true for Route subsubclass instance', () => {
		class SubClass extends Route {}
		class SubSubClass extends SubClass {}
		const route = new SubSubClass();
		expect(isRoute(route)).toBeTrue();
	});

	it('returns false for Route class', () => {
		expect(isRoute(Route)).toBeFalse();
	});

	it('returns false for Route subclass', () => {
		class SubClass extends Route {}
		expect(isRoute(SubClass)).toBeFalse();
	});

	it('returns false for Route subsubclass', () => {
		class SubClass extends Route {}
		class SubSubClass extends SubClass {}
		expect(isRoute(SubSubClass)).toBeFalse();
	});

	it('returns false for object', () => {
		expect(isRoute({})).toBeFalse();
	});

	it('returns false for function', () => {
		expect(isRoute(() => {})).toBeFalse();
	});

	it('returns false for null', () => {
		expect(isRoute(null)).toBeFalse();
	});
});

describe('`.isRouteClass()`', () => {
	it('returns true for Route class', () => {
		expect(isRouteClass(Route)).toBeTrue();
	});

	it('returns true for Route subclass', () => {
		class SubClass extends Route {}
		expect(isRouteClass(SubClass)).toBeTrue();
	});

	it('returns true for Route subsubclass', () => {
		class SubClass extends Route {}
		class SubSubClass extends SubClass {}
		expect(isRouteClass(SubSubClass)).toBeTrue();
	});

	it('returns false for Route instance', () => {
		const route = new Route();
		expect(isRouteClass(route)).toBeFalse();
	});

	it('returns false for Route subclass instance', () => {
		class SubClass extends Route {}
		const route = new SubClass();
		expect(isRouteClass(route)).toBeFalse();
	});

	it('returns false for Route subsubclass instance', () => {
		class SubClass extends Route {}
		class SubSubClass extends SubClass {}
		const route = new SubSubClass();
		expect(isRouteClass(route)).toBeFalse();
	});

	it('returns false for object', () => {
		expect(isRouteClass({})).toBeFalse();
	});

	it('returns false for function', () => {
		expect(isRouteClass(() => {})).toBeFalse();
	});

	it('returns false for null', () => {
		expect(isRouteClass(null)).toBeFalse();
	});
});
