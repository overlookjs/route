/* --------------------
 * @overlook/route module
 * Route class static extend method
 * ------------------*/

'use strict';

// Modules
const {classExtend} = require('class-extension'),
	{isPlugin} = require('@overlook/plugin');

// Exports

/**
 * Extend Route class using plugin
 * @param {Object} plugin - Plugin
 * @returns {Route} - Route subclass
 */
module.exports = function(plugin) {
	// Validate plugin
	if (!isPlugin(plugin)) throw new TypeError('Plugin must be created with @overlook/plugin');

	// Apply plugin to this Route class
	return classExtend(this, plugin);
};
