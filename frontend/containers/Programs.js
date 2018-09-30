import React, { Component } from 'react';
import { Row, Col, Card, Button, List, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PageFormat from '../components/PageFormat';

import actions from '../actions';

class Programs extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		const { programs, loadPrograms } = this.props;
		if (!programs) {
			loadPrograms();
		}
	}

	render() {
		const { programs, loading, error } = this.props;
		if (error) {
			return (
				<PageFormat page="programs" loading={loading}>
					<p>{error}</p>
				</PageFormat>
			);
		}

		return (
			<PageFormat page="programs" loading={loading}>
				<List
					itemLayout="horizontal"
					dataSource={programs}
					renderItem={program => {
						return (
							<Link to={`/program/${program._id}`}>
								<List.Item
									actions={[
										<Button to={`/program/${program._id}`}>
											View<Icon type="right" />
										</Button>,
									]}>
									<List.Item.Meta
										title={program.name}
										description={program.description}
									/>
								</List.Item>
							</Link>
						);
					}}
				/>
			</PageFormat>
		);
	}
}

const mapStateToProps = state => {
	return {
		programs: state.programs.data,
		loading: state.programs.loading,
		error: state.programs.error,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.programs }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Programs)
);
