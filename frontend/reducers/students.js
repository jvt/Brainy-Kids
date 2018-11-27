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
			//filter out state.students.data by student id
			//action.student will contain the single student that i DO want to modify
			//second filter where student_id is equal (can use .find)
			//take single student i find and set the name (action.name)
			//use concatatate to take unmodified array and append the one i changed
			//return object with data: concatenated array
			const studentToChange = state.data.filter(item => item.student_id === action.student_id);
			const withoutEdit = state.data.filter(item => item.student_id !== action.student_id);
			studentToChange[0]['student_name'] = action.student_name;
			const concat_arr = withoutEdit.concat(studentToChange);
			console.log(concat_arr);
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
