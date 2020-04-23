/* --------------------
 * @overlook/route module
 * Symbols
 * ------------------*/

'use strict';

// Modules
const makeSymbols = require('@overlook/util-make-symbols');

// Imports
const pkgName = require('../package.json').name;

// Exports

module.exports = makeSymbols(pkgName, [
	'ROUTE_VERSION',
	'ROUTER_PATH',
	'INIT_PROPS',
	'INIT_ROUTE',
	'INIT_CHILDREN',
	'IS_INITIALIZED',
	'ATTACH_TO',
	'DEBUG_ZONE',
	'DEBUG_ERROR'
]);
