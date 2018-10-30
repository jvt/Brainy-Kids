import * as types from '../types';
import { generateAPIHeaders } from '../helpers/util';

module.exports.login = (token, teacher) => {
	return {
		type: types.LOGIN,
		token,
		teacher,
	};
};

module.exports.logout = () => {
	return {
		type: types.LOGOUT,
	};
};

const reloadTeacherDataLoading = () => {
	return {
		type: types.RELOAD_TEACHER_DATA_LOADING,
	};
};

const reloadTeacherDataSuccess = teacher => {
	return {
		type: types.RELOAD_TEACHER_DATA_SUCCESS,
		teacher,
	};
};

const reloadTeacherDataError = error => {
	return {
		type: types.RELOAD_TEACHER_DATA_ERROR,
		error,
	};
};

module.exports.reloadTeacherData = () => {
	return (dispatch, getState) => {
		dispatch(reloadTeacherDataLoading());
		fetch(`/api/session/info`, {
			method: 'GET',
			headers: generateAPIHeaders(getState),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					return dispatch(reloadTeacherDataError(json.message));
				}
				return dispatch(reloadTeacherDataSuccess(json.teacher));
			})
			.catch(err => dispatch(reloadTeacherDataError(err)));
	};
};
