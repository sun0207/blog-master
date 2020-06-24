import * as types from '../types.js';

/**
 * action type
 */

export function saveNav(data) {
	return {
		type: types.ACTIVE_NAV,
		payload: data,
	};
}
