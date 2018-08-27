import React, { Component } from 'react';
import { Row, Col, Card, List, Icon, Progress } from 'antd';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';
import NotFound from './NotFound';

import moment from 'moment';

const users = [
	{
		_id: '21349',
		name: 'Joe Torraca',
		assignemntCompleted: 20,
		phonicsCompletion: 80,
		rhymeAZooCompletion: 100,
		lastEvent: new Date('04/02/2018')
	},
	{
		_id: '1042890',
		name: 'Paul Dorsch',
		assignemntCompleted: 90,
		phonicsCompletion: 93,
		rhymeAZooCompletion: 95,
		lastEvent: new Date('03/28/2018')
	},
	{
		_id: '1038392',
		name: 'Eric Sheen',
		assignemntCompleted: 23,
		phonicsCompletion: 67,
		rhymeAZooCompletion: 89,
		lastEvent: new Date('04/01/2018')
	},
	{
		_id: '32174890',
		name: 'Luke Senseney',
		assignemntCompleted: 100,
		phonicsCompletion: 100,
		rhymeAZooCompletion: 98,
		lastEvent: new Date('04/04/2018')
	},
	{
		_id: '1234125',
		name: 'Asher Kenerly',
		assignemntCompleted: 4,
		phonicsCompletion: 16,
		rhymeAZooCompletion: 12,
		lastEvent: new Date('02/20/2018')
	}
]

class UserShow extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const user = users.filter(u => u._id === this.props.match.params.id)[0];
		if (!user) {
			return <NotFound/>;
		}
		return (
			<div>
				<PageFormat page="users" title={user.name}>
					<p><b>Last Activity Date:</b> {moment(user.lastEvent).format('MMMM Do, YYYY')}</p>
					<Row type="flex" justify="space-between" style={{width: '100%', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 10}}>
						<Col xs={8} style={{textAlign: 'center'}}>
							<h3>Assignments Completed</h3>
							<Progress type="dashboard" percent={user.assignemntCompleted} status={user.assignemntCompleted === 100 ? `success` : 'active'} format={(percent) => `${percent}%`}/>
						</Col>
						<Col xs={8} style={{textAlign: 'center'}}>
							<h3>Phonics Completion</h3>
							<Progress type="dashboard" percent={user.phonicsCompletion} status={user.phonicsCompletion === 100 ? `success` : 'active'} format={(percent) => `${percent}%`}/>
						</Col>
						<Col xs={8} style={{textAlign: 'center'}}>
							<h3>Rhyme a Zoo Completion</h3>
							<Progress type="dashboard" percent={user.rhymeAZooCompletion} status={user.rhymeAZooCompletion === 100 ? `success` : 'active'} format={(percent) => `${percent}%`} />
						</Col>
					</Row>
					<Row type="flex" justify="space-between" style={{width: '100%', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 10}}>
						<Col xs={24}>
							<h3>Problem Areas</h3>
							<p><Icon type="warning" />&nbsp;Took <b>9 times</b> to complete a <b>Phonics</b> assignment</p>
							<p><Icon type="exclamation-circle-o" />&nbsp;<b>Rhyme a Zoo</b> assignment took <b>30 minutes</b> to complete</p>
						</Col>
					</Row>
				</PageFormat>
			</div>
		)
	}
}

export default withRouter(UserShow);