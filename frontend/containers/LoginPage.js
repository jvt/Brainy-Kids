import React, { Component } from 'react';

import { Row, Col, Card, Input, Button } from 'antd';

import { Link, withRouter } from 'react-router-dom';

class LoginPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Row type="flex" justify="center" style={{marginTop: 100}}>
				<Col xs={24} sm={24} md={12} lg={8}>
					<Card title="Login to Portal">
						<div style={{textAlign: 'right'}}>
							<Input placeholder="Email" type="email" style={{marginTop: 20}}/>
							<Input placeholder="password" type="password" style={{marginTop: 20}}/>
							<Link to="/dashboard"><Button style={{textAlign: 'center', marginTop: 20}} type="primary">Login</Button></Link>
						</div>
					</Card>
				</Col>
			</Row>
		)
	}
}

export default withRouter(LoginPage);