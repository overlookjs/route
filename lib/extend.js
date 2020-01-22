/* --------------------
 * @overlook/route module
 * Route class static extend method
 * ------------------*/

'use strict';

// Modules
const {classExtend} = require('class-extension'),
	{PLUGIN_VERSION} = require('@overlook/plugin');

// Exports

/**
 * Extend Route class using plugin
 * @param {Object} plugin - Plugin
 * @returns {Route} - Route subclass
 */
module.exports = function(plugin) {
	// Validate plugin
	if (!plugin || !plugin[PLUGIN_VERSION]) {
		throw new TypeError('Plugin must be created with @overlook/plugin');
	}

	// Apply plugin to this Route class
	return classExtend(this, plugin);
};
