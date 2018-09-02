import * as types from '../types';

module.exports.showGlobalLoading = () => {
	return {
		type: types.SHOW_GLOBAL_LOADING,
	};
};

module.exports.hideGlobalLoading = () => {
	return {
		type: types.HIDE_GLOBAL_LOADING,
	};
};
