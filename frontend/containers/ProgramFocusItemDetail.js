import React, { Component } from 'react';
import { Row, Col, Button, Card, List, Icon, Breadcrumb, Divider } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';
import NotFound from './NotFound';

const PageBreadcrumb = ({ program, focus_item }) => {
	return (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link to="/programs">Programs</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to={`/program/${program._id}`}>{program.name}</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to={`/program/${program._id}/${focus_item._id}`}>
					{focus_item.name}
				</Link>
			</Breadcrumb.Item>
		</Breadcrumb>
	);
};

class ProgramFocusItemDetail extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { programs, students } = this.props;
		if (!programs) {
			this.props.loadPrograms();
		}

		// if (!students) {
		// 	this.props.loadStudents();
		// }
	}

	render() {
		const { loading, programs } = this.props;

		// We're currently updating the Redux store with all programs
		if (loading || !programs) {
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
					title={`${program.name} — ${focus_item.name}`}
					breadcrumb={
						<PageBreadcrumb
							program={program}
							focus_item={focus_item}
						/>
					}>
					<Divider />
					<p>Students will go here...</p>
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
		loading: state.programs ? state.programs.loading : false,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.programs }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ProgramFocusItemDetail)
);
