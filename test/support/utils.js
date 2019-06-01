/* --------------------
 * @overlook/route
 * Tests utilities
 * ------------------*/

'use strict';

// Exports
module.exports = {
	tryCatch,
	rejectionReason
};

function tryCatch(fn) {
	try {
		fn();
		return undefined;
	} catch (err) {
		return err;
	}
}

function rejectionReason(promise) {
	return promise.then(
		() => undefined,
		err => err
	);
}
