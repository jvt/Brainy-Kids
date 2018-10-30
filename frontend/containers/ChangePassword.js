import React, { Component } from 'react';
import { Row, Col, Card, Breadcrumb } from 'antd';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';

const PageBreadcrumb = () => {
	return (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link to="/account">My Account</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to={`/account/password`}>Change Your Password</Link>
			</Breadcrumb.Item>
		</Breadcrumb>
	);
};

class ChangePassword extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<PageFormat
					page="account"
					title="Change Your Password"
					breadcrumb={<PageBreadcrumb />}>
					<p>Test</p>
				</PageFormat>
			</div>
		);
	}
}

export default withRouter(ChangePassword);
