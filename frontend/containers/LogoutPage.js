import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';

import PageFormat from '../components/PageFormat';

class LogoutPage extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.logout();
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.token) this.props.history.replace('/');
	}

	render() {
		return <PageFormat page="Logging Out" loading />;
	}
}

const mapStateToProps = state => {
	return {
		token: state.teacher.token,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.teacher }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(LogoutPage)
);
