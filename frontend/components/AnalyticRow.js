import React from 'react';

import { Row, Col, Divider } from 'antd';
import { Link } from 'react-router-dom';

const AnalyticRow = ({ student, program, analytic }) => {
	let A1Label;
	let A1;
	let A2Label;
	let A2;

	if (analytic.correct_on) {
		A1Label = 'Time Spent';
		A1 = analytic.time_spent;
		A2Label = 'Correct On';
		A2 = analytic.correct_on;
	} else {
		A1Label = 'Time Watching';
		A1 = analytic.time_watching;
		A2Label = 'Total Video Time';
		A2 = analytic.total_video_time;
	}

	const url = student
		? `/student/${student._id}`
		: `/program/${program._id}/${analytic.focus_item.unit}/${
				analytic.focus_item.sub_unit
		  }/${analytic.focus_item._id}`;

	return (
		<Row className="highlight-on-hover border-bottom row-padded">
			<Link to={url}>
				{student && (
					<Col xs={24} sm={24} md={10} lg={10} xl={10}>
						<h3>
							<b>
								{student.student_name
									? student.student_name
									: student.student_id}
							</b>
						</h3>
						<p>Student</p>
					</Col>
				)}
				{program && (
					<Col xs={24} sm={24} md={10} lg={10} xl={10}>
						<h3>
							<b>{program.name}</b>
						</h3>
						<p>Program</p>
					</Col>
				)}
				<Col
					xs={24}
					sm={24}
					md={7}
					lg={7}
					xl={7}
					style={{ textAlign: 'center' }}>
					<h3>
						<b>{A1}</b>
					</h3>
					<p>{A1Label}</p>
				</Col>
				<Col
					xs={24}
					sm={24}
					md={7}
					lg={7}
					xl={7}
					style={{ textAlign: 'center' }}>
					<h3>
						<b>{A2}</b>
					</h3>
					<p>{A2Label}</p>
				</Col>
			</Link>
		</Row>
	);
};

export default AnalyticRow;
