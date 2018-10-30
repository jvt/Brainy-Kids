import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

import { Menu, Icon, Row, Col } from 'antd';

class SideNav extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let selectedKey = this.props.active || 'dashboard';
		if (selectedKey === 'home') {
			selectedKey = 'dashboard';
		}

		return (
			<Col xs={0} sm={0} md={5} style={{ height: '100vh' }}>
				<Menu
					style={{ width: '100%', height: '100vh' }}
					defaultSelectedKeys={[selectedKey]}
					mode="inline">
					<Menu.Item
						key="home"
						style={{ marginTop: 20, marginBottom: 20 }}>
						<Link to="/dashboard">
							<h2>
								<b>Brainy Kids</b>
							</h2>
						</Link>
					</Menu.Item>
					<Menu.Item key="dashboard">
						<Link to="/dashboard">
							<Icon type="dashboard" />Dashboard
						</Link>
					</Menu.Item>
					<Menu.Item key="programs">
						<Link to="/programs">
							<Icon type="mobile" />Programs
						</Link>
					</Menu.Item>
					<Menu.Item key="students">
						<Link to="/students">
							<Icon type="user" />Students
						</Link>
					</Menu.Item>
					<Menu.Item key="logout">
						<Link to="/logout">
							<Icon type="logout" />Logout
						</Link>
					</Menu.Item>
				</Menu>
			</Col>
		);
	}
}

export default withRouter(SideNav);
