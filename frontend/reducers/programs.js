import * as types from '../types';

const initialState = {
	data: null,
	loading: true,
	error: null,
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case types.LOAD_PROGRAMS:
			return {
				...state,
				loading: true,
			};

		case types.LOAD_PROGRAMS_SUCCESS:
			return {
				...state,
				loading: false,
				data: action.programs,
				error: null,
			};

		case types.LOAD_PROGRAMS_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};

		default:
			return state;
	}
}
