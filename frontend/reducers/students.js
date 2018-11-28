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
				data: sortStudents(action.students),
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
				data: sortStudents(state.data.concat([action.student])), // Turn this into an array so we can use the .concat() method
			};

		case types.LOAD_STUDENT_NAME:
			const studentToChange = state.data.filter(
				item => item.student_id === action.student_id
			);
			const withoutEdit = state.data.filter(
				item => item.student_id !== action.student_id
			);
			studentToChange[0]['student_name'] = action.student_name;
			const concat_arr = withoutEdit.concat(studentToChange);
			const sorted = sortStudents(concat_arr);

			return {
				...state,
				loading: false,
				data: sorted,
				error: null,
			};

		default:
			return state;
	}
}

const sortStudents = students => {
	return students.sort((a, b) => {
		if (parseInt(a.student_id) > parseInt(b.student_id)) {
			return 1;
		} else if (parseInt(a.student_id) < parseInt(b.student_id)) {
			return -1;
		}
		return 0;
	});
};
