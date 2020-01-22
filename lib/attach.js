/* --------------------
 * @overlook/route module
 * Attach children methods to be merged into Route prototype
 * ------------------*/

'use strict';

// Imports
const Route = require('./index'),
	{IS_INITIALIZED, ATTACH_TO, DEBUG_ZONE, DEBUG_ERROR} = require('./symbols');

// Exports
module.exports = {
	attachChild(route) {
		// Check is instance of Route class
		if (!(route instanceof Route)) {
			throw this[DEBUG_ERROR](
				new Error('attachChild must be called with an instance of Route class')
			);
		}

		// Check is not already initialized
		if (this[IS_INITIALIZED]) {
			throw this[DEBUG_ERROR](new Error('Cannot attach children after initialization'));
		}

		// Attach child
		route[DEBUG_ZONE](
			() => route[ATTACH_TO](this)
		);
		this.children.push(route);

		// Return this for chaining
		return this;
	},

	[ATTACH_TO](parent) {
		this.parent = parent;
	}
};
