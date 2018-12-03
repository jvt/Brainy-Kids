import React, { Component } from 'react';
import {
	Row,
	Col,
	Button,
	Card,
	List,
	Icon,
	Table,
	Breadcrumb,
	Divider,
	notification,
} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const { Column } = Table;

import actions from '../actions';
import { generateAPIHeadersWithToken } from '../helpers/util';

import PageFormat from '../components/PageFormat';

import AnalyticRow from '../components/AnalyticRow';

import { Link, withRouter } from 'react-router-dom';
import NotFound from './NotFound';

const PageBreadcrumb = ({ program, unit, subunit, focus_item }) => {
	return (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link to="/programs">Programs</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to={`/program/${program._id}`}>{program.name}</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to={`/program/${program._id}/${unit}`}>{unit}</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to={`/program/${program._id}/${unit}/${subunit}`}>
					{subunit}
				</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link
					to={`/program/${program._id}/${unit}/${subunit}/${
						focus_item._id
					}`}>
					{focus_item.name}
				</Link>
			</Breadcrumb.Item>
		</Breadcrumb>
	);
};

const NoAnalyticRow = ({ student }) => {
	return (
		<Row
			style={{
				paddingTop: 24,
				paddingBottom: 24,
			}}>
			<Col xs={24} sm={24} md={10} lg={10} xl={10}>
				<h3>
					<Link
						to={`/student/${student._id}`}
						style={{
							color: 'rgba(0, 0, 0, 0.65)',
							textDecoration: 'underline',
						}}>
						<b>
							{student.student_name
								? student.student_name
								: student.student_id}
						</b>
					</Link>
				</h3>
				<p>Student</p>
			</Col>
			<Col
				xs={24}
				sm={24}
				md={14}
				lg={14}
				xl={14}
				style={{
					textAlign: 'center',
				}}>
				<p>Student has not completed this focus item</p>
			</Col>
			<Divider />
		</Row>
	);
};

class ProgramFocusItemDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			analytics: null,
		};

		this.loadFocusItemAnalytics = this.loadFocusItemAnalytics.bind(this);
		this.getStudentDataForId = this.getStudentDataForId.bind(this);
	}

	componentWillMount() {
		const { programs, students, match } = this.props;
		if (!programs) {
			this.props.loadPrograms();
		}

		if (!students) {
			this.props.loadStudents();
		}

		this.loadFocusItemAnalytics();
	}

	getStudentDataForId(id) {
		const { students } = this.props;
		return students.find(s => s._id === id);
	}

	loadFocusItemAnalytics() {
		const { token, match } = this.props;
		fetch(`/api/analytics/focusitem?populate=true`, {
			method: 'POST',
			headers: generateAPIHeadersWithToken(token),
			body: JSON.stringify({
				focus_item: match.params.focus_item,
			}),
		})
			.then(res => res.json())
			.then(json => {
				if (json.status !== 'ok') {
					notification.error({
						message: 'Server Error',
						description: json.message,
					});
				} else {
					this.setState({ analytics: json.analytics });
				}
			})
			.catch(err => {
				console.error(err);
				notification.error({
					message: 'Server Error',
					description:
						'Uh oh! An unexpected server error has occurred',
				});
			});
	}

	render() {
		const {
			programsLoading,
			studentsLoading,
			programs,
			students,
			match,
		} = this.props;

		const { analytics } = this.state;

		// We're currently updating the Redux store with all programs
		if (
			programsLoading ||
			!programs ||
			studentsLoading ||
			!students ||
			analytics === null
		) {
			return (
				<div>
					<PageFormat page="programs" title={'Loading...'} loading />
				</div>
			);
		}

		// Pull the program out of the Redux store
		const program = programs.find(
			p => p._id === this.props.match.params.id
		);

		// Program is not found
		if (!program) {
			return <NotFound />;
		}

		// Pull the program out of the Redux store
		const focus_item = program.focus_items.find(
			f => f._id === this.props.match.params.focus_item
		);

		// Focus Item is not found
		if (!focus_item) {
			return <NotFound />;
		}

		return (
			<div>
				<PageFormat
					page="programs"
					title={`${program.name} (${focus_item.name})`}
					breadcrumb={
						<PageBreadcrumb
							program={program}
							unit={match.params.unit}
							subunit={match.params.subunit}
							focus_item={focus_item}
						/>
					}>
					<h2
						style={{
							fontWeight: 300,
						}}>
						Students
					</h2>
					<Divider style={{ marginBottom: 0 }} />
					{analytics !== null && (
						<List
							itemLayout="horizontal"
							dataSource={Object.keys(analytics)}
							renderItem={student_id => {
								const record = analytics[student_id];
								const student = this.getStudentDataForId(
									student_id
								);
								if (!record) {
									return <NoAnalyticRow student={student} />;
								} else {
									return (
										<AnalyticRow
											student={student}
											analytic={record}
										/>
									);
								}
							}}
						/>
					)}
				</PageFormat>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		token: state.teacher.token,
		programs: state.programs ? state.programs.data : null,
		students: state.students ? state.students.data : null,
		studentsLoading: state.students ? state.students.loading : false,
		programsLoading: state.programs ? state.programs.loading : false,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{ ...actions.programs, ...actions.students },
		dispatch
	);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ProgramFocusItemDetail)
);
