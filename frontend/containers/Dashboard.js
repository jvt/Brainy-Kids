import React, { Component } from 'react';
import { Row, Col, Card, Icon } from 'antd';

import PageFormat from '../components/PageFormat';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';

import { Link, withRouter } from 'react-router-dom';

class Dashboard extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { programs, loadPrograms, students, loadStudents } = this.props;
		if (!programs) {
			loadPrograms();
		}
		if (!students) {
			loadStudents();
		}
	}

	render() {
		const { students, programs } = this.props;

		if (!students || !programs) {
			return <PageFormat page="dashboard" loading />;
		}

		return (
			<PageFormat page="dashboard">
				<Row type="flex" justify="">
					<Col span={4}>
						<Link to="/students">
							<div
								className="clearfix"
								style={{
									textAlign: 'center',
									border: '1px solid rgba(0,0,0,0.1)',
									borderRadius: 4,
									padding: 20,
								}}>
								{students === null && <Icon type="loading" />}
								{students !== null && (
									<h2>{students.length}</h2>
								)}
								{students !== null && <p>Students</p>}
							</div>
						</Link>
					</Col>
					<Col span={4} offset={1}>
						<Link to="/programs">
							<div
								className="clearfix"
								style={{
									textAlign: 'center',
									border: '1px solid rgba(0,0,0,0.1)',
									borderRadius: 4,
									padding: 20,
								}}>
								{programs === null && <Icon type="loading" />}
								{programs !== null && (
									<h2>{programs.length}</h2>
								)}
								{programs !== null && <p>Programs</p>}
							</div>
						</Link>
					</Col>
				</Row>
			</PageFormat>
		);
	}
}

const mapStateToProps = state => {
	return {
		students: state.students.data,
		programs: state.programs.data,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{ ...actions.students, ...actions.programs },
		dispatch
	);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Dashboard)
);
