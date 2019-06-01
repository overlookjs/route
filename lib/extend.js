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

/**
 * Extend Route class.
 * Uses a cache stored to ensure if called with the same extension again,
 * the same subclass is returned, rather than creating another identical subclass.
 * @param {function} extension - Extension function
 * @returns {Route} - Extended route class
 */
module.exports = function(extension) {
	// Validate extention argument
	if (!isFunction(extension)) throw new TypeError('Argument passed to .extend() must be a function');

	// If already extended with this extension, do not extend again
	let identifier = extension.IDENTIFIER;
	if (identifier != null) {
		if (!isSymbol(identifier)) {
			throw new Error('extension.IDENTIFIER must be a Symbol if defined');
		}
		if (this[identifier]) return this;
	} else {
		// No identifier - create one
		identifier = Symbol('UNIDENTIFIED_ROUTER');
		extension.IDENTIFIER = identifier;
	}

	// Init cache
	let cache;
	if (hasOwnProperty(this, CACHE)) {
		cache = this[CACHE];
	} else {
		cache = new Map();
		this[CACHE] = cache;
	}

	// If in cache, return it
	const Cached = cache.get(extension);
	if (Cached) return Cached;

	// If not in cache, extend
	const RouteExtended = extension(this);
	RouteExtended[identifier] = true;
	RouteExtended.prototype[identifier] = true;

	// Add to cache
	cache.set(extension, RouteExtended);

	// Return subclass
	return RouteExtended;
};
