import React from 'react';

import { Row, Col, Card } from 'antd';

import { withRouter, Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<Row type="flex" justify="center">
			<Col xs={24} sm={24} md={18} lg={8}>
				<Card title="Not Found">
					<h2>404</h2>
					<p>Oops, it looks like you stumbled upon a page which doesn't exist. Go home <Link to="/dashboard">here</Link>.</p>
				</Card>
			</Col>
		</Row>
	);
}

export default withRouter(NotFound);