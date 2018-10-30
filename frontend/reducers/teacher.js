import * as types from '../types';

const initialState = {
	token: null,
	data: null,
	error: null,
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

		case types.RELOAD_TEACHER_DATA_LOADING:
			return {
				...state,
				loading: true,
			};

		case types.RELOAD_TEACHER_DATA_SUCCESS:
			return {
				...state,
				loading: false,
				data: action.teacher,
				error: null,
			};

		case types.RELOAD_TEACHER_DATA_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};

		default:
			return state;
	}
}
