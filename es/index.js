/* --------------------
 * @overlook/route module
 * ESM entry point
 * Re-export CJS with named exports
 * ------------------*/

// Exports

import Route from '../lib/index.js';

export default Route;
export const {
	// Static methods
	isRoute,
	isRouteClass,

	// Symbols
	ROUTE_VERSION,
	ROUTER_PATH,
	INIT_PROPS,
	INIT_ROUTE,
	INIT_CHILDREN,
	IS_INITIALIZED,
	ATTACH_TO,
	DEBUG_ZONE,
	DEBUG_ERROR,
	PLUGINS,
	NAMED_PLUGINS
} = Route;
