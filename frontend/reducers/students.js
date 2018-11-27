import * as types from '../types';

const initialState = {
	data: null,
	loading: true,
	error: null,
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case types.LOAD_STUDENTS:
			return {
				...state,
				loading: true,
			};

		case types.LOAD_STUDENTS_SUCCESS:
			return {
				...state,
				loading: false,
				data: action.students,
				error: null,
			};

		case types.LOAD_STUDENTS_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};

		case types.APPEND_STUDENT:
			return {
				...state,
				data: state.data.concat([action.student]), // Turn this into an array so we can use the .concat() method
			};
		
		case types.LOAD_STUDENT_NAME:
			const studentToChange = state.data.filter(item => item.student_id === action.student_id);
			const withoutEdit = state.data.filter(item => item.student_id !== action.student_id);
			studentToChange[0]['student_name'] = action.student_name;
			const concat_arr = withoutEdit.concat(studentToChange);
			return {
				...state,
				loading: false,
				data: concat_arr,
				error: null,
			};

		default:
			return state;
	}
}
