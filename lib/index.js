/* --------------------
 * @overlook/route module
 * Route class
 * ------------------*/

'use strict';

// Modules
const {EXTENSIONS, NAMED_EXTENSIONS} = require('class-extension');

// Imports
const symbols = require('./symbols.js'),
	{ROUTE_VERSION, INIT_PROPS, INIT_ROUTE, INIT_CHILDREN, IS_INITIALIZED, DEBUG_ZONE} = symbols,
	pkgVersion = require('../package.json').version;

// Exports

class Route {
	constructor(props) {
		this.name = undefined;
		this.parent = undefined;
		this.children = [];
		this.root = undefined;
		this[IS_INITIALIZED] = false;

		this[INIT_PROPS](props);

		Object.assign(this, props);
	}

	// Intended to be extended in subclasses
	[INIT_PROPS]() { // eslint-disable-line class-methods-use-this
		// Do nothing
	}

	// Should NOT be extended in subclasses
	init() {
		return this[DEBUG_ZONE](async () => {
			await this[INIT_ROUTE]();
			this[IS_INITIALIZED] = true;
			await this[INIT_CHILDREN]();
		});
	}

	// Intended to be extended in subclasses
	async [INIT_ROUTE]() {
		const {parent} = this;
		this.root = parent ? parent.root : this;
	}

	// Intended to be extended in subclasses
	[INIT_CHILDREN]() {
		return Promise.all(
			this.children.map(child => child.init())
		);
	}

	// Intended to be extended in subclasses
	handle() { // eslint-disable-line class-methods-use-this
		// Do not handle
		return undefined;
	}

	static isRoute(r) {
		return !!r && r[IS_INITIALIZED] !== undefined;
	}

	static isRouteClass(R) {
		return !!R && !!R[ROUTE_VERSION];
	}
}

// Export symbols
Object.assign(Route, symbols, {PLUGINS: EXTENSIONS, NAMED_PLUGINS: NAMED_EXTENSIONS});

// Set version symbol on constructor
Route[ROUTE_VERSION] = pkgVersion;

module.exports = Route;

// Add methods from other files
// NB Imports are here rather than at top of file as `./attach.js` requires this file in turn.
Route.extend = require('./extend.js');
Object.assign(Route.prototype, require('./attach.js'), require('./debug.js'));
