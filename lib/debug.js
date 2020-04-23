/* --------------------
 * @overlook/route module
 * Debug methods to be merged into Route prototype
 * ------------------*/

'use strict';

// Modules
const isPromise = require('is-promise');

// Imports
const {ROUTER_PATH, DEBUG_ZONE, DEBUG_ERROR} = require('./symbols.js');

// Exports

module.exports = {
	[DEBUG_ZONE](fn) {
		const throwErr = (err) => {
			if (!err || !err[ROUTER_PATH]) err = this[DEBUG_ERROR](err);
			throw err;
		};

		let ret;
		try {
			ret = fn();
		} catch (err) {
			throwErr(err);
		}

		if (isPromise(ret)) ret = ret.catch(throwErr);

		return ret;
	},

	[DEBUG_ERROR](err) {
		// Conform error to Error class instance
		err = conformError(err);

		// Get router path
		let path = '',
			ancestor = this;
		while (true) { // eslint-disable-line no-constant-condition
			const nextAncestor = ancestor.parent;
			if (!nextAncestor) break;
			path = `/${ancestor.name || '?'}${path}`;
			ancestor = nextAncestor;
		}
		if (path === '') path = '/';

		// Augment error
		err[ROUTER_PATH] = path;
		err.message += ` (router path ${path})`;
		return err;
	}
};

function conformError(err) {
	if (err instanceof Error) return err;

	const wrapped = new Error(`Unknown error: ${err}`);
	wrapped.parent = err;
	return wrapped;
}
