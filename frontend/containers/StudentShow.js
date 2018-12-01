import React, { Component } from 'react';
import { Row, Col, Card, List, Icon, Progress, Button, message } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';
import NotFound from './NotFound';

import moment from 'moment';

import actions from '../actions';

const DeleteButton = props => {
	return (
		<Button
			onClick={props.onClick}
			loading={props.loading}
			type={props.loading ? 'dashed' : 'danger'}>
			{!props.loading && <Icon type="delete" />}
		</Button>
	);
};

class StudentShow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
		};
		this.deleteStudent = this.deleteStudent.bind(this);
	}

	deleteStudent(id) {
		this.props.deleteStudent(id);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.students !== this.props.students) {
			this.setState({ loading: false });

			const { students, match } = this.props;
			const studentObjectIdParam = match.params.id;

			const student = students.find(s => s._id === studentObjectIdParam);
			if (student === null) {
				this.props.history.push('/students');
			}
		}
	}

	render() {
		const { students, match } = this.props;
		const studentObjectIdParam = match.params.id;

		if (!students || students.length === 0) {
			this.setState({ loading: true });
			this.props.loadStudents();
		}

		const student = students.find(s => s._id === studentObjectIdParam);

		if (!student) {
			message.success('Student has been successfully deleted');
			this.props.history.push('/students');
			return <div />;
		}

		const studentName = student
			? student.student_name
				? student.student_name
				: student.student_id
			: 'Student Detail';

		return (
			<div>
				<PageFormat
					page="students"
					title={studentName}
					extra={
						<DeleteButton
							onClick={() => this.deleteStudent(student._id)}
							loading={
								student.queuedForDeletion
									? student.queuedForDeletion
									: false
							}
						/>
					}
					loading={this.state.loading}>
					{/*<p>
						<b>Last Activity Date:</b>{' '}
						{moment(user.lastEvent).format('MMMM Do, YYYY')}
					</p>*/}
					{/*<Row
						type="flex"
						justify="space-between"
						style={{
							width: '100%',
							borderTop: '1px solid rgba(0,0,0,0.1)',
							paddingTop: 10,
						}}>
						<h3>Recent Focus Items</h3>
					</Row>*/}
				</PageFormat>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		students: state.students ? state.students.data : [],
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.students }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(StudentShow)
);
