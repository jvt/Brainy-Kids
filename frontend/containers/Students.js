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
	message,
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CSVLink, CSVDownload } from "react-csv";

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
		const reader = new FileReader();

		reader.onload = (input => {
			return function(e) {};
		})(e.file);

		reader.readAsDataURL(e.file);
	}

	newStudentOnChange(student_id) {
		this.setState({
			student_id: `${student_id}`, // We cast it to a string so we can use .length on it
		});
	}

	fileToJson(file) {
		const { teacher, students, loadStudentName } = this.props;
		var fr = new FileReader();

		var nameMap = new Map();
		fr.onload = function(e) {
			var lines = e.target.result.split('\n');
			for (var i = 0; i < lines.length; i++) {
				var currentline = lines[i].split(',');
				var teacher_id_from_csv = currentline[0].substr(0, 3);
				if (currentline[0].length === 0 && currentline[1].length <= 1) {
					continue;
				} else if (currentline[0].length !== 6) {
					var error_text =
						'The line containing ' +
						currentline[1] +
						' should be of format 001001 where the first 3' +
						' digits are the teacher id and the last 3 are student id.';
					message.error(error_text);
					continue;
				}
				if (teacher_id_from_csv === teacher.teacher_id) {
					var csv_id = currentline[0].substr(
						currentline[0].length - 3
					);
					nameMap.set(csv_id, currentline[1]);
				} else {
					var error_text =
						currentline[1] +
						' does not have the correct 3 digit teacher_id';
					message.error(error_text);
				}
			}
			for (var n = 0; n < students.length; n++) {
				var s = students[n]['student_id'];
				if (nameMap.has(s) && s !== null) {
					loadStudentName(nameMap.get(s), s);
				}
			}
		};
		fr.readAsText(file);
	}

	genFile() {
		const { teacher, students } = this.props;
		var csv_arr = [];
		students.forEach(function(s){
			let first = teacher.teacher_id.toString() + s.student_id.toString();
			let second = "<Insert Student Name Here>";
			let temp = [first, second];
			csv_arr.push(temp);
		});
		return csv_arr;
		
	}

	render() {
		const { teacher, students, loading, error } = this.props;

		const { createStudentLoading } = this.state;
		var csv_arr = this.genFile();
		return (
			<PageFormat
				page="students"
				loading={loading}
				popover={<PopoverComponent />}
				extra={
					<div>
						<CSVLink filename='students_template' data={csv_arr}>
							<Button 
								style={{
									marginLeft: 5,
									marginRight: 5,
								}}
								type="secondary">
								Download Class CSV
							</Button>
						</CSVLink>
						<Button
							style={{
								marginLeft: 5,
								marginRight: 5,
							}}
							type="primary"
							onClick={() => this.setModalVisibility(true)}>
							New Student
						</Button>
					</div>
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
						accept={'.csv'}
						onChange={this.onChange}
						beforeUpload={file => {
							this.fileToJson(file);
							return false;
						}}>
						<Button>Upload CSV File</Button>
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
											{student.student_name === null ||
											!('student_name' in student)
												? student.student_id
												: student.student_name}
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
