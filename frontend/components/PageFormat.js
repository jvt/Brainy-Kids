import React from 'react';

import { Row, Col, Card } from 'antd';

import SideNav from './SideNav';

export default function PageFormat({page, title, children}) {
	return (
		<Row type="flex" justify="space-between">
			<SideNav active={page} />
			<Col xs={24} sm={24} md={18}>
				<Card>
					<h1>{title ? title : page.charAt(0).toUpperCase()+page.slice(1)}</h1>
					{children}
				</Card>
			</Col>
		</Row>
	)
}