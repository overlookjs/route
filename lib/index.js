/* --------------------
 * @overlook/route module
 * Route class
 * ------------------*/

'use strict';

// Imports
const symbols = require('./symbols'),
	{ROUTE_VERSION} = symbols,
	pkgVersion = require('../package.json').version;

// Exports
class Route {
	constructor(props) {
		this.name = undefined;
		this.parent = undefined;
		this.app = undefined;
		this.children = [];
		this.isInitialized = false;

		this.initProps(props);

		Object.assign(this, props);
	}

	initProps() { // eslint-disable-line class-methods-use-this
		// Do nothing - intended to be extended by subclasses
	}

	init(app) {
		return this.debugZone(() => {
			this.initRoute(app);
			this.isInitialized = true;
			this.initChildren(app);
		});
	}

	initRoute(app) {
		this.app = app;
	}

	initChildren(app) {
		for (const child of this.children) {
			child.debugZone(() => {
				child.init(app);
			});
		}
	}

	handle() { // eslint-disable-line class-methods-use-this
		// No handling - intended to be extended by subclasses
		return null;
	}
}

// Export symbols
Object.assign(Route, symbols);

// Set version symbol on constructor + prototype
Route[ROUTE_VERSION] = pkgVersion;
Route.prototype[ROUTE_VERSION] = pkgVersion;

module.exports = Route;

// Add methods from other files
// NB Imports are here rather than at top of file as `./attach` requires this file in turn.
Route.extend = require('./extend');
Object.assign(Route.prototype, require('./attach'), require('./debug'));
