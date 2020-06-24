import * as types from '../types';

/**
 * state
 */
const initState = {
	userInfo: {
		avatar: '',
		create_time: '',
		email: '',
		id: '',
		img_url: '',
		introduce: '',
		name: '',
		password: '',
		phone: '',
		type: '',
		update_time: '',
		__v: 0,
		_id: '',
	},
	message: '',
	refresh: 1,
};

/**
 * reducer
 * @param {*} state 
 * @param {*} action 
 */
export function user(state = initState, action) {
	switch (action.type) {
		case types.LOGIN_SUCCESS:
			return {
				...state,
				userInfo: action.payload.data,
				message: action.payload.message,
			};
		case types.REGISTER_SUCCESS:
			return {
				...state,
				userInfo: '',
				message: action.payload.message,
			};
		case types.LOGOUT:
			return {
				userInfo: '',
				message: '',
				refresh: 0,
			};
		case types.LOGIN_FAILURE:
		case types.REGISTER_FAILURE:
			return {
				...state,
				userInfo: '',
				message: action.payload,
			};
		default:
			return state;
	}
}
