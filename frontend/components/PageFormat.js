import React from 'react';

import { Row, Col, Card, Icon } from 'antd';

import SideNav from './SideNav';

export default function PageFormat({
	page,
	title,
	popover,
	children,
	loading,
	breadcrumb,
	extra,
}) {
	return (
		<Row type="flex" justify="space-between">
			<SideNav active={page} />
			<Col xs={24} sm={24} md={18}>
				{breadcrumb ? (
					<Card style={{ marginBottom: 10 }}>{breadcrumb}</Card>
				) : null}
				<Card>
					<Row
						style={{
							display: 'flex',
							flex: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}>
						<div style={{ flex: 1 }}>
							<h1 style={{ display: 'inline-block' }}>
								{title
									? title
									: page.charAt(0).toUpperCase() +
									  page.slice(1)}
							</h1>
							{popover ? popover : null}
						</div>
						<div style={{ flex: 1, textAlign: 'right' }}>
							{extra}
						</div>
					</Row>
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
