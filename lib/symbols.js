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
	'ROUTER_PATH'
]);
