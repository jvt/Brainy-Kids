import * as types from '../types';

const initialState = {
	loading: false,
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case types.SHOW_GLOBAL_LOADING:
			return {
				...state,
				loading: true,
			};

		case types.HIDE_GLOBAL_LOADING:
			return {
				...state,
				loading: false,
			};

		default:
			return state;
	}
}
