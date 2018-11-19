import React, { Component } from 'react';
import {
	Row,
	Col,
	Button,
	Card,
	Breadcrumb,
	Input,
	Form,
	notification,
} from 'antd';

const FormItem = Form.Item;

import PageFormat from '../components/PageFormat';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

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

		this.state = {
			loading: false,
		};

		this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
		this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
		this.validateToNextPassword = this.validateToNextPassword.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	handleConfirmBlur(e) {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}

	compareToFirstPassword(rule, value, callback) {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback("The two passwords you entered don't match.");
		} else {
			callback();
		}
	}

	validateToNextPassword(rule, value, callback) {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ loading: true });
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				fetch(`/api/session/resetpassword`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.props.token}`,
					},
					body: JSON.stringify({
						password: values.password,
						confirm_password: values.confirm_password,
					}),
				})
					.then(res => res.json())
					.then(json => {
						this.setState({ loading: false });
						if (json.status !== 'ok') {
							notification.error({
								message: 'Oops!',
								description:
									json.errors && json.errors.length > 0
										? json.errors[0].msg
										: json.message ||
										  'An unexpected system error has occurred. Please try again in a few moments.',
							});
						} else {
							this.props.form.setFieldsValue({
								password: '',
								confirm_password: '',
							});
							notification.success({
								message: 'Password changed!',
								description: `Your password has been successfully updated.`,
							});
						}
					})
					.catch(err => {
						console.error(err);
						notification.error({
							message: 'Oops!',
							description:
								err.messsage ||
								'An unexpected system error has occurred. Please try again in a few moments.',
						});
					});
			} else {
				this.setState({ loading: false });
			}
		});
	}

	render() {
		const formItemLayout = {
			labelCol: null,
			wrapperCol: null,
		};

		return (
			<div>
				<PageFormat
					page="account"
					title="Change Your Password"
					breadcrumb={<PageBreadcrumb />}>
					<Row>
						<Col xs={24} sm={20} md={16} lg={12} xl={12}>
							<Form onSubmit={this.onSubmit} layout="vertical">
								<FormItem label="Password">
									{getFieldDecorator('password', {
										rules: [
											{
												required: true,
												message:
													'Please input your password!',
											},
											{
												min: 8,
												message:
													'A minimum password length of 8 is required',
											},
											{
												validator: this
													.validateToNextPassword,
											},
										],
									})(
										<Input
											type="password"
											placeholder="••••••••"
										/>
									)}
								</FormItem>
								<FormItem label="Confirm Password">
									{getFieldDecorator('confirm_password', {
										rules: [
											{
												required: true,
												message:
													'Please confirm your password!',
											},
											{
												min: 8,
												message:
													'A minimum password length of 8 is required',
											},
											{
												validator: this
													.compareToFirstPassword,
											},
										],
									})(
										<Input
											type="password"
											placeholder="••••••••"
											onBlur={this.handleConfirmBlur}
										/>
									)}
								</FormItem>
								<FormItem>
									<Button
										type="primary"
										htmlType="submit"
										loading={this.state.loading}
										disabled={this.state.loading}>
										Change Password
									</Button>
								</FormItem>
							</Form>
						</Col>
					</Row>
				</PageFormat>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		token: state.teacher.token,
	};
};

export default withRouter(
	connect(mapStateToProps)(Form.create()(ChangePassword))
);
