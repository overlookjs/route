/* --------------------
 * @overlook/route module
 * Attach children methods to be merged into Route prototype
 * ------------------*/

'use strict';

// Imports
const Route = require('./index');

// Exports
module.exports = {
	attachChild(route) {
		// Check is instance of Route class
		if (!(route instanceof Route)) {
			throw new Error('attachChild must be called with an instance of Route class');
		}

		// Check is not already initialized
		if (this.isInitialized) throw new Error('Cannot attach children after initialization');

		// Attach child
		route.attachTo(this);
		this.children.push(route);

		// Return this for chaining
		return this;
	},

	attachTo(parent) {
		this.parent = parent;
	}
};
