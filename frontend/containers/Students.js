import React, { Component } from 'react';
import { Row, Col, Card, List } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PageFormat from '../components/PageFormat';

import actions from '../actions';

class Students extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { students, loadStudents } = this.props;
		if (!students) {
			loadStudents();
		}
	}

	render() {
		const { students, loading, error } = this.props;

		console.log(error);
		console.log(students);
		console.log(loading);

		if (error) {
			return (
				<PageFormat page="students" loading={loading}>
					<p>{error}</p>
				</PageFormat>
			);
		}

		return (
			<PageFormat page="students" loading={loading}>
				<List
					itemLayout="horizontal"
					dataSource={students}
					renderItem={student => (
						<List.Item
							actions={[
								<Link to={`/students/${student._id}`}>
									View Student
								</Link>,
							]}>
							<List.Item.Meta
								title={
									<Link to={`/students/${student._id}`}>
										{student.student_id}
									</Link>
								}
								description=""
							/>
						</List.Item>
					)}
				/>
			</PageFormat>
		);
	}
}

const mapStateToProps = state => {
	return {
		students: state.students.data,
		loading: state.students.loading,
		error: state.students.error,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.students }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Students)
);
