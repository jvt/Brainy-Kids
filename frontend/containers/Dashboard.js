import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';

class Dashboard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<PageFormat page="dashboard">
				<Row type="flex" justify="">
					<Col span={4}>
						<Link to="/users">
							<div className="clearfix" style={{textAlign: 'center', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, padding: 20}}>
								<h2>5</h2>
								<p>Students</p>
							</div>
						</Link>
					</Col>
					<Col span={4} offset={1}>
						<Link to="/users">
							<div className="clearfix" style={{textAlign: 'center', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 4, padding: 20}}>
								<h2>84%</h2>
								<p>Completed</p>
							</div>
						</Link>
					</Col>
				</Row>
			</PageFormat>
		)
	}
}

export default withRouter(Dashboard);