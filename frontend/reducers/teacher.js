import * as types from '../types';

const initialState = {
	token: null,
	data: null,
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case types.LOGIN:
			return {
				...state,
				data: action.teacher,
				token: action.token,
			};

		case types.LOGOUT:
			return {
				...state,
				data: null,
				token: null,
			};

		default:
			return state;
	}
}
