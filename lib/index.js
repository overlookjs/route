/* --------------------
 * @overlook/route module
 * Route class
 * ------------------*/

'use strict';

// Exports
class Route {
	constructor(props) {
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
		this.initRoute(app);
		this.isInitialized = true;
		this.initChildren(app);
	}

	initRoute(app) {
		this.app = app;
	}

	initChildren(app) {
		for (const child of this.children) {
			child.init(app);
		}
	}

	handle() { // eslint-disable-line class-methods-use-this
		// No handling - intended to be extended by subclasses
		return null;
	}

	debugError(msg, props) {
		// Construct path
		let path = '',
			ancestor = this;
		while (true) { // eslint-disable-line no-constant-condition
			const nextAncestor = ancestor.parent;
			if (!nextAncestor) break;
			path = `/${ancestor.name || '?'}${path}`;
			ancestor = nextAncestor;
		}
		if (path === '') path = '/';

		// Construct error
		const err = new Error(`${msg} (in router path ${path})`);
		Object.assign(err, props);
		err.routerPath = path;
		return err;
	}
}

module.exports = Route;

// Add methods from other files
// NB Imports are here rather than at top of file as `./attach` requires this file in turn.
Route.extend = require('./extend');
Object.assign(Route.prototype, require('./attach'));
