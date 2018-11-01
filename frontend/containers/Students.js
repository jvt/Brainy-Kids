import React, { Component } from 'react';
import {
	Button,
	Modal,
	Row,
	Col,
	Card,
	List,
	Popover,
	Upload,
	Icon,
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PageFormat from '../components/PageFormat';
import NewStudentModal from '../components/NewStudentModal';

import actions from '../actions';

const PopoverComponent = () => {
	return (
		<Popover
			style={{ width: 400, display: 'inline-block' }}
			content="To ensure student privacy, we do not store student names in our database. To view the student names on this page, you'll need to upload the Excel sheet which will correlate the student IDs to their respective names. This spreadsheet will never be uploaded to our servers."
			title="Why are there no names?">
			<Icon
				type="info-circle"
				style={{ marginLeft: 10, position: 'relative', top: -5 }}
			/>
		</Popover>
	);
};

class Students extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalVisibility: false,
		};

		this.setModalVisibility = this.setModalVisibility.bind(this);
	}

	componentWillMount() {
		const { students, loadStudents } = this.props;
		if (!students) {
			loadStudents();
		}
	}

	setModalVisibility(value) {
		this.setState({ modalVisibility: value });
	}

	onChange(e) {
		console.log(e);
		const reader = new FileReader();

		reader.onload = (input => {
			return function(e) {
				console.log(e);
			};
		})(e.file);

		reader.readAsDataURL(e.file);
	}

	render() {
		const { teacher, students, loading, error } = this.props;

		// if (error) {
		// 	return (
		// 		<PageFormat page="students" loading={loading}>
		// 			<p>{error}</p>
		// 		</PageFormat>
		// 	);
		// }

		return (
			<PageFormat
				page="students"
				loading={loading}
				popover={<PopoverComponent />}
				extra={
					<Button
						type="primary"
						onClick={() => this.setModalVisibility(true)}>
						New Student
					</Button>
				}>
				<div
					style={{
						width: '100%',
						backgroundColor: 'rgb(245, 245, 245)',
						paddingTop: 10,
						paddingBottom: 10,
						textAlign: 'center',
					}}>
					<Upload
						data={e => console.log(e)}
						onChange={this.onChange}
						beforeUpload={file => {
							return false;
						}}>
						<Button>Upload Excel File</Button>
					</Upload>
				</div>
				<NewStudentModal
					visible={this.state.modalVisibility}
					onOk={() => this.setModalVisibility(false)}
					onCancel={() => this.setModalVisibility(false)}
				/>
				{!students || students.length === 0 ? (
					<p>You have no students in your classes yet.</p>
				) : (
					<List
						itemLayout="horizontal"
						dataSource={students}
						renderItem={student => (
							<List.Item
								actions={[
									<Link to={`/students/${student._id}`}>
										View Student
									</Link>,
								]}>
								<List.Item.Meta
									title={
										<Link to={`/students/${student._id}`}>
											{student.student_id}
										</Link>
									}
									description=""
								/>
							</List.Item>
						)}
					/>
				)}
			</PageFormat>
		);
	}
}

const mapStateToProps = state => {
	return {
		teacher: state.teacher.data,
		students: state.students.data,
		loading: state.students.loading,
		error: state.students.error,
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ...actions.students }, dispatch);
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Students)
);
