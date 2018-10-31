import * as types from '../types';
import * as util from '../helpers/util';

const loadProgramsSuccess = programs => {
	return {
		type: types.LOAD_PROGRAMS_SUCCESS,
		programs,
	};
};

const loadProgramsError = error => {
	return {
		type: types.LOAD_PROGRAMS_ERROR,
		error,
	};
};

const loadProgramsLoading = () => {
	return {
		type: types.LOAD_PROGRAMS,
	};
};

module.exports.loadPrograms = () => {
	return (dispatch, getState) => {
		dispatch(loadProgramsLoading());
		fetch(`/api/programs?focus_items=true`, {
			method: 'GET',
			headers: util.generateAPIHeaders(getState),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					return dispatch(loadProgramsError(json.message));
				}
				return dispatch(loadProgramsSuccess(json.programs));
			})
			.catch(err => {
				return dispatch(loadProgramsError(err));
			});
	};
};
