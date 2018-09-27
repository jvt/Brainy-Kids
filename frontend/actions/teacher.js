import * as types from '../types';

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
