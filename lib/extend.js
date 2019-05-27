/* --------------------
 * @overlook/route module
 * Route class static extend method
 * ------------------*/

'use strict';

// Modules
const {isFunction, isSymbol} = require('core-util-is'),
	hasOwnProperty = require('has-own-prop');

// Constants
const CACHE = Symbol('CACHE');

// Exports
module.exports = extend;

/**
 * Extend Route class.
 * Uses a cache stored to ensure if called with the same extension again,
 * the same subclass is returned, rather than creating another identical subclass.
 * @param {function} extension - Extension function
 * @param {...function} extensions - Additional extension functions
 * @returns {Route} - Extended route class
 */
function extend(extension, ...extensions) {
	const RouteExtended = extendOne(this, extension); // eslint-disable-line no-invalid-this
	if (extensions.length === 0) return RouteExtended;
	return RouteExtended.extend(...extensions);
}

function extendOne(Route, extension) {
	// Validate extention argument
	if (!isFunction(extension)) throw new TypeError('Argument passed to .extend() must be a function');

	// If already extended with this extension, do not extend again
	let identifier = extension.IDENTIFIER;
	if (identifier != null) {
		if (!isSymbol(identifier)) {
			throw new Error('extension.IDENTIFIER must be a Symbol if defined');
		}
		if (Route[identifier]) return Route;
	} else {
		// No identifier - create one
		identifier = Symbol('UNIDENTIFIED_ROUTER');
		extension.IDENTIFIER = identifier;
	}

	// Init cache
	let cache;
	if (hasOwnProperty(Route, CACHE)) {
		cache = Route[CACHE];
	} else {
		cache = new Map();
		Route[CACHE] = cache;
	}

	// If in cache, return it
	const Cached = cache.get(extension);
	if (Cached) return Cached;

	// If not in cache, extend
	const RouteExtended = extension(Route);
	RouteExtended[identifier] = true;
	RouteExtended.prototype[identifier] = true;

	// Add to cache
	cache.set(extension, RouteExtended);

	// Return subclass
	return RouteExtended;
}
