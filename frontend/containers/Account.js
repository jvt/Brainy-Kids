import React, { Component } from 'react';
import { Button, Row, Col, Card } from 'antd';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';

class Account extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<PageFormat page="account" title="My Account">
				<Link to="/account/password">
					<Button secondary>Change Password</Button>
				</Link>
			</PageFormat>
		);
	}
}

export default withRouter(Account);
