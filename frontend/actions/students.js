import * as types from '../types';
import * as util from '../helpers/util';

const loadStudentsSuccess = students => {
	return {
		type: types.LOAD_STUDENTS_SUCCESS,
		students,
	};
};

const loadStudentsError = error => {
	console.log(error);
	return {
		type: types.LOAD_STUDENTS_ERROR,
		error,
	};
};

const loadStudentsLoading = () => {
	console.log('loading students');
	return {
		type: types.LOAD_STUDENTS,
	};
};

module.exports.loadStudents = () => {
	return (dispatch, getState) => {
		dispatch(loadStudentsLoading());
		fetch(`/api/students`, {
			method: 'GET',
			headers: util.generateAPIHeaders(getState),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					console.log(json.message);
					return dispatch(loadStudentsError(json.message));
				}
				return dispatch(loadStudentsSuccess(json.programs));
			})
			.catch(err => {
				console.error(err);
				return dispatch(loadStudentsError(err));
			});
	};
};
