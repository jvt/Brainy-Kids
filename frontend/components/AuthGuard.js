import React from 'react';

import { Card, Icon, Row, Col } from 'antd';

import LoadingScreen from './LoadingScreen';

import { withRouter, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import actions from '../actions';

import { bindActionCreators } from 'redux';

const AuthGuard = ({
	component: Component,
	teacher,
	token,
	history,
	adminCheck,
	reloadTeacherData,
	...rest
}) => {
	if (token && !teacher) {
		reloadTeacherData();
		return <Route {...rest} render={props => <LoadingScreen />} />;
	} else if (token && teacher) {
		return <Route {...rest} render={props => <Component {...props} />} />;
	}
	return <Redirect to="/" />;
};

const mapStateToProps = state => {
	return {
		teacher: state.teacher.data ? state.teacher.data : null,
		token: state.teacher.token ? state.teacher.token : null,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.teacher }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(AuthGuard)
);
