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
	return {
		type: types.LOAD_STUDENTS,
	};
};

module.exports.loadStudentName = (student_name, student_id) => {
	return {
		type: types.LOAD_STUDENT_NAME,
		student_name,
		student_id,
	};
};

const deleteStudentLoading = id => {
	return {
		type: types.DELETE_STUDENT,
		id,
	};
};

const deleteStudentSuccess = id => {
	return {
		type: types.DELETE_STUDENT_SUCCESS,
		id,
	};
};

const deleteStudentError = (id, error) => {
	return {
		type: types.DELETE_STUDENT_ERROR,
		error,
	};
};

module.exports.deleteStudent = id => {
	return (dispatch, getState) => {
		dispatch(deleteStudentLoading(id));
		fetch(`/api/student/${id}`, {
			method: 'DELETE',
			headers: util.generateAPIHeaders(getState),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					console.log(json.message);
					return dispatch(deleteStudentSuccess(json.message));
				}
				return dispatch(deleteStudentSuccess(id));
			})
			.catch(err => {
				console.error(err);
				return dispatch(deleteStudentError(err));
			});
	};
};

module.exports.loadStudents = () => {
	return (dispatch, getState) => {
		dispatch(loadStudentsLoading());
		fetch(`/api/teacher/${getState().teacher.data._id}/students`, {
			method: 'GET',
			headers: util.generateAPIHeaders(getState),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					console.log(json.message);
					return dispatch(loadStudentsError(json.message));
				}
				return dispatch(loadStudentsSuccess(json.students));
			})
			.catch(err => {
				console.error(err);
				return dispatch(loadStudentsError(err));
			});
	};
};

module.exports.appendStudent = student => {
	return {
		type: types.APPEND_STUDENT,
		student,
	};
};
