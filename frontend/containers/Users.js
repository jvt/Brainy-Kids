import React, { Component } from 'react';
import { Row, Col, Card, List } from 'antd';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';

const users = [
	{
		_id: '21349',
		name: 'Joe Torraca',
		lastEvent: new Date('04/02/2018')
	},
	{
		_id: '1042890',
		name: 'Paul Dorsch',
		lastEvent: new Date('03/28/2018')
	},
	{
		_id: '1038392',
		name: 'Eric Sheen',
		lastEvent: new Date('04/01/2018')
	},
	{
		_id: '32174890',
		name: 'Luke Senseney',
		lastEvent: new Date('04/04/2018')
	},
	{
		_id: '1234125',
		name: 'Asher Kenerly',
		lastEvent: new Date('02/20/2018')
	}
]

class Users extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<PageFormat page="users">
				<List
				   itemLayout="horizontal"
				   dataSource={users}
				   renderItem={user => (
				     <List.Item actions={[<Link to={`/users/${user._id}`}>View Student</Link>]}>
				       <List.Item.Meta
				         title={<Link to={`/users/${user._id}`}>{user.name}</Link>}
				         description=""
				       />
				     </List.Item>
				   )}
				 />
			</PageFormat>
		)
	}
}

export default withRouter(Users);