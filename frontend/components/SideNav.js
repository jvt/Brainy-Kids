import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

import { Menu, Icon, Row, Col } from 'antd';

const Nav = ({ selectedKey, textEnabled, align, logo }) => {
	return (
		<Menu
			style={{ width: '100%', height: '100%', minWidth: 60 }}
			defaultSelectedKeys={[selectedKey]}
			mode="inline">
			{logo && (
				<Menu.Item
					key="home"
					style={{ marginTop: 20, marginBottom: 20 }}>
					<Link to="/dashboard">
						<h2>
							<b>Brainy Kids</b>
						</h2>
					</Link>
				</Menu.Item>
			)}
			<Menu.Item
				key="dashboard"
				style={{
					marginTop: logo ? 4 : 80,
					paddingLeft: 0,
					paddingRight: 0,
					textAlign: align,
				}}>
				<Link to="/dashboard">
					<Icon type="dashboard" />
					{textEnabled ? 'Dashboard' : null}
				</Link>
			</Menu.Item>
			<Menu.Item
				key="programs"
				style={{
					paddingLeft: 0,
					paddingRight: 0,
					textAlign: align,
				}}>
				<Link to="/programs">
					<Icon type="mobile" />
					{textEnabled ? 'Programs' : null}
				</Link>
			</Menu.Item>
			<Menu.Item
				key="students"
				style={{
					paddingLeft: 0,
					paddingRight: 0,
					textAlign: align,
				}}>
				<Link to="/students">
					<Icon type="user" />
					{textEnabled ? 'Students' : null}
				</Link>
			</Menu.Item>
			<Menu.Item
				key="account"
				style={{
					paddingLeft: 0,
					paddingRight: 0,
					textAlign: align,
				}}>
				<Link to="/account">
					<Icon type="idcard" />
					{textEnabled ? 'My Account' : null}
				</Link>
			</Menu.Item>
			<Menu.Item
				key="logout"
				style={{
					paddingLeft: 0,
					paddingRight: 0,
					textAlign: align,
				}}>
				<Link to="/logout">
					<Icon type="logout" />
					{textEnabled ? 'Logout' : null}
				</Link>
			</Menu.Item>
		</Menu>
	);
};

const SideNav = ({ active }) => {
	let selectedKey = active || 'dashboard';
	if (selectedKey === 'home') {
		selectedKey = 'dashboard';
	}

	return (
		<div>
			<Col
				xs={0}
				sm={0}
				md={5}
				style={{ height: '100vh', position: 'fixed' }}>
				<Nav
					selectedKey={selectedKey}
					textEnabled
					align={'left'}
					logo
				/>
			</Col>
			<Col
				xs={0}
				sm={2}
				md={0}
				style={{ height: '100vh', position: 'fixed' }}>
				<Nav
					selectedKey={selectedKey}
					textEnabled={false}
					align={'left'}
					logo={false}
				/>
			</Col>
		</div>
	);
};

export default withRouter(SideNav);
