import React, { Component } from 'react';
import { Row, Col, Button, Card, List, Icon, Breadcrumb, Divider } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';
import NotFound from './NotFound';

const PageBreadcrumb = ({ program }) => {
	return (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link to="/programs">Programs</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to={`/program/${program._id}`}>{program.name}</Link>
			</Breadcrumb.Item>
		</Breadcrumb>
	);
};

class ProgramDetail extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { programs } = this.props;
		if (programs === null || programs === undefined) {
			this.props.loadPrograms();
		}
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

		return (
			<div>
				<PageFormat
					page="programs"
					title={program.name}
					breadcrumb={<PageBreadcrumb program={program} />}>
					{program.description && <p>{program.description}</p>}
					<Divider />
					<h2
						style={{
							fontWeight: 300,
						}}>
						Focus Items
					</h2>
					{program.focus_items.length > 0 ? (
						<List
							itemLayout="horizontal"
							dataSource={program.focus_items}
							renderItem={focus_item => {
								return (
									<Link
										to={`/program/${program._id}/${
											focus_item._id
										}`}>
										<List.Item
											actions={[
												<Button
													to={`/program/${
														program._id
													}/${focus_item._id}`}>
													View<Icon type="right" />
												</Button>,
											]}>
											<List.Item.Meta
												title={focus_item.name}
											/>
										</List.Item>
									</Link>
								);
							}}
						/>
					) : (
						<div>
							<p>
								<Icon type="warn" />There are no Focus Items
								associated with this application. This is most
								likely an application error. Please contact the
								developer of the application.
							</p>
						</div>
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
	)(ProgramDetail)
);
