/* --------------------
 * @overlook/route module
 * Route class static extend method
 * ------------------*/

'use strict';

// Modules
const {extend} = require('class-extension'),
	{isPlugin} = require('@overlook/plugin');

// Exports

/**
 * Extend Route class using plugin
 * @param {Object} plugin - Plugin
 * @param {Object} [options] - Options object
 * @returns {Route} - Route subclass
 */
module.exports = function(plugin, options) {
	// Validate plugin
	if (!isPlugin(plugin)) throw new TypeError('Plugin must be created with @overlook/plugin');

	// Apply plugin to this Route class
	return extend.call(this, plugin, options);
};
