import React, { Component } from 'react';
import { Row, Col, Button, Card, List, Icon, Breadcrumb, Divider } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../actions';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';
import NotFound from './NotFound';

const UNIT = 'unit';
const SUBUNIT = 'subunit';
const FOCUS_ITEMS = 'focus_items';

const PageBreadcrumb = ({ program, unit, subunit }) => {
	return (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link to="/programs">Programs</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to={`/program/${program._id}`}>{program.name}</Link>
			</Breadcrumb.Item>
			{unit && (
				<Breadcrumb.Item>
					<Link to={`/program/${program._id}/${unit}`}>{unit}</Link>
				</Breadcrumb.Item>
			)}
			{subunit && (
				<Breadcrumb.Item>
					<Link to={`/program/${program._id}/${unit}/${subunit}`}>
						{subunit}
					</Link>
				</Breadcrumb.Item>
			)}
		</Breadcrumb>
	);
};

const UnitList = ({ program, unit }) => {
	return (
		<Link to={`/program/${program._id}/${unit}`}>
			<List.Item
				actions={[
					<Button>
						View Unit<Icon type="right" />
					</Button>,
				]}>
				<List.Item.Meta title={unit} />
			</List.Item>
		</Link>
	);
};

const SubUnitList = ({ program, unit, subunit }) => {
	return (
		<Link to={`/program/${program._id}/${unit}/${subunit}`}>
			<List.Item
				actions={[
					<Button>
						View Sub-Unit<Icon type="right" />
					</Button>,
				]}>
				<List.Item.Meta title={subunit} />
			</List.Item>
		</Link>
	);
};

const FocusItemList = ({ program, unit, subunit, focus_item }) => {
	return (
		<Link
			to={`/program/${program._id}/${unit}/${subunit}/${focus_item._id}`}>
			<List.Item
				actions={[
					<Button>
						View Focus Item<Icon type="right" />
					</Button>,
				]}>
				<List.Item.Meta title={focus_item.name} />
			</List.Item>
		</Link>
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

	uniqueBy(arr, prop) {
		return arr.reduce((a, d) => {
			if (!a.includes(d[prop])) {
				a.push(d[prop]);
			}
			return a;
		}, []);
	}

	render() {
		const { loading, programs, match } = this.props;

		// We're currently updating the Redux store with all programs
		if (loading || !programs) {
			return (
				<div>
					<PageFormat page="programs" title={'Loading...'} loading />
				</div>
			);
		}

		// Pull the program out of the Redux store
		const program = programs.find(p => p._id === match.params.id);

		// Program is not found
		if (!program) {
			return <NotFound />;
		}

		// Escape before doing any UNIT/SUBUNIT tree building
		if (program.focus_items.length === 0) {
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
						<div>
							<p>
								<Icon type="warn" />There are no Focus Items
								associated with this application. This is most
								likely an application error. Please contact the
								developer of the application.
							</p>
						</div>
					</PageFormat>
				</div>
			);
		}

		let listData = program.focus_items;
		let mode = null;

		if (match.params.unit === undefined) {
			// We have neither a unit or subunit
			// Show all units for the Teacher to dive down into
			mode = UNIT;
			listData = this.uniqueBy(program.focus_items, 'unit');
		} else {
			if (match.params.subunit === undefined) {
				// We have a unit, but no subunit
				mode = SUBUNIT;
				const units = program.focus_items.filter(
					fi => fi.unit === match.params.unit
				);
				listData = this.uniqueBy(units, 'subunit');
			} else {
				// We have both a unit AND subunit
				mode = FOCUS_ITEMS;
				listData = program.focus_items.filter(
					fi =>
						fi.unit === match.params.unit &&
						fi.subunit === match.params.subunit
				);
			}
		}

		return (
			<div>
				<PageFormat
					page="programs"
					title={program.name}
					boldTitle
					breadcrumb={
						<PageBreadcrumb
							program={program}
							unit={match.params.unit}
							subunit={match.params.subunit}
						/>
					}>
					{program.description && <p>{program.description}</p>}
					<Divider />
					<h2
						style={{
							fontWeight: 300,
						}}>
						{mode === UNIT && 'Units'}
						{mode === SUBUNIT && 'Sub-Units'}
						{mode === FOCUS_ITEMS && 'Focus Items'}
					</h2>
					<Divider />
					{listData.length === 0 ? (
						<div>
							<p>
								<Icon type="warn" />
								There are no {mode}'s found. This is most likely
								an application error.
							</p>
						</div>
					) : (
						<List
							itemLayout="horizontal"
							dataSource={listData}
							renderItem={e => {
								switch (mode) {
									case UNIT:
										return (
											<UnitList
												program={program}
												unit={e}
											/>
										);

									case SUBUNIT:
										return (
											<SubUnitList
												program={program}
												unit={match.params.unit}
												subunit={e}
											/>
										);

									case FOCUS_ITEMS:
										return (
											<FocusItemList
												program={program}
												unit={match.params.unit}
												subunit={match.params.subunit}
												focus_item={e}
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
