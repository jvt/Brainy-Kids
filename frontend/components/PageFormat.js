import React from 'react';

import { Row, Col, Card, Icon } from 'antd';

import SideNav from './SideNav';

export default function PageFormat({
	page,
	title,
	children,
	loading,
	breadcrumb,
}) {
	return (
		<Row type="flex" justify="space-between">
			<SideNav active={page} />
			<Col xs={24} sm={24} md={18}>
				{breadcrumb ? (
					<Card style={{ marginBottom: 10 }}>{breadcrumb}</Card>
				) : null}
				<Card>
					<h1>
						{title
							? title
							: page.charAt(0).toUpperCase() + page.slice(1)}
					</h1>
					{loading ? (
						<div style={{ width: '100%', textAlign: 'center' }}>
							<Icon
								type="loading"
								style={{
									color: '#1890ff',
									fontSize: 40,
									textAlign: 'center',
								}}
							/>
						</div>
					) : (
						children
					)}
				</Card>
			</Col>
		</Row>
	);
}
