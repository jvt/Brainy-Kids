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
	notification,
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
			createStudentLoading: false,
			student_id: '',
		};

		this.createStudent = this.createStudent.bind(this);
		this.newStudentOnChange = this.newStudentOnChange.bind(this);
		this.setModalVisibility = this.setModalVisibility.bind(this);
	}

	createStudent() {
		const { token, students } = this.props;
		const { student_id } = this.state;
		if (!student_id || student_id.length !== 3) {
			return notification.error({
				message: 'Uh oh!',
				description: 'Please enter a 3-digit student ID number',
			});
		}

		const alreadyUsedCheck = students.find(s => {
			return s.student_id === student_id;
		});

		if (alreadyUsedCheck) {
			return notification.error({
				message: 'Uh oh!',
				description: 'That student ID is already in use.',
			});
		}

		this.setState({ createStudentLoading: true });

		fetch(`/api/student`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				teacher: this.props.teacher._id,
				student_id,
			}),
		})
			.then(res => res.json())
			.then(json => {
				this.setState({ createStudentLoading: false });
				if (json.status === 'ok') {
					this.props.appendStudent(json.student);
					notification.success({
						message: 'Success!',
						description:
							'That student has been created successfully!',
					});
					this.setModalVisibility(false);
				} else {
					notification.error({
						message: 'Uh oh!',
						description:
							json.errors && json.errors.length > 0
								? json.errors[0].msg
								: json.message ||
								  'An unexpected system error has occurred.',
					});
				}
			})
			.catch(err => {
				console.error(err);
				this.setState({ createStudentLoading: true });
				notification.error({
					message: 'System error',
					description:
						"Uh oh! An unexpected system error has occurred. We're sorry!",
				});
			});
	}

	componentWillMount() {
		const { students, loadStudents } = this.props;
		if (!students) {
			loadStudents();
		}
	}

	setModalVisibility(value) {
		this.setState({ modalVisibility: value, student_id: '' });
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

	newStudentOnChange(student_id) {
		this.setState({
			student_id: `${student_id}`, // We cast it to a string so we can use .length on it
		});
	}

	printFile(file) {
		var fr = new FileReader();
		fr.onload = function(e) {
			// e.target.result should contain the text
			console.log(e.target.result);
			var names_json = {};
			var lines = e.target.result.split('/n');
			var headers = ['id', 'name'];
			for(var i=0;i<lines.length;i++){
				var obj = {};
				var currentline=lines[i].split(",");
				for(var j=0;j<headers.length;j++){
					obj[headers[j]] = currentline[j];
				}
				result.push(obj);
			}
			JSON.stringify(result);
		};
		fr.readAsText(file);
	}	


	render() {
		const { teacher, students, loading, error } = this.props;

		const { createStudentLoading } = this.state;

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
						//data={e => console.log(e)}
						onChange={this.onChange}
						beforeUpload={file => {
							this.printFile(file);
							return false;
						}}>
						<Button>Upload Excel File</Button>
					</Upload>
				</div>
				<NewStudentModal
					visible={this.state.modalVisibility}
					loading={createStudentLoading}
					onOk={this.createStudent}
					onCancel={() => this.setModalVisibility(false)}
					onChange={this.newStudentOnChange}
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
		token: state.teacher.token,
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
