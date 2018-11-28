const mongoose = require('mongoose');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const Analytic = require('../models/analytic');
const Focus_Item = require('../models/teacher');
const Program = require('../models/program');

module.exports.hearatale = (req, res) => {
	const analytic = new Analytic({
		student: req.body.student,
		program: req.body.program,
		focus_item: req.body.focus_item,
		time_watching: req.body.time_watching,
		total_video_time: req.body.total_video_time,
	});

	if (req.body.created_at) {
		analytic.created_at = req.body.created_at;
	}
	if (req.body.updated_at) {
		analytic.updated_at = req.body.updated_at;
	}

	analytic
		.save()
		.then(analytic => {
			return res.status(200).json({
				status: 'ok',
				analytic: analytic,
			});
		})
		.catch(err => {
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		});
};

module.exports.application = (req, res) => {
	const analytic = new Analytic({
		student: req.body.student,
		program: req.body.program,
		focus_item: req.body.focus_item,
		correct_on: req.body.correct_on,
		time_spent: req.body.time_spent,
	});

	if (req.body.created_at) {
		analytic.created_at = req.body.created_at;
	}
	if (req.body.updated_at) {
		analytic.updated_at = req.body.updated_at;
	}

	analytic
		.save()
		.then(analytic => {
			return res.status(200).json({
				status: 'ok',
				analytic: analytic,
			});
		})
		.catch(err => {
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		});
};

module.exports.focusItem = async (req, res) => {
	let students = [];

	if (!req.user.teacher_id) {
		return res.status(401).json({
			status: 'error',
			message: "You don't have permission for this",
		});
	}

	let analytics = {};
	if (req.body.student || req.body.students) {
		if (req.body.student) {
			students.push(mongoose.Types.ObjectId(req.body.student));
		} else {
			students = req.body.students.map(mongoose.Types.ObjectId);
		}
		for (student of students) {
			let studentObject = await Student.findById(student);
			if (studentObject) {
				if (
					req.user._id.toString() != studentObject.teacher.toString()
				) {
					return res.status(401).json({
						status: 'error',
						message: "You don't have permission for this",
					});
				}
				analytics[student.toString()] = null;
			} else {
				analytics[student.toString()] = { error: 'Student not found' };
			}
		}
	} else {
		students = (await Student.find({ teacher: req.user._id })).map(
			student => student._id
		);
		for (student of students) {
			analytics[student] = null;
		}
	}

	var analyticsArray = await Analytic.find({
		student: { $in: students },
		focus_item: req.body.focus_item,
	})
		.populate(req.query.populate === 'true' ? 'student' : [])
		.exec();
	for (analytic of analyticsArray) {
		analytics[
			req.query.populate === 'true'
				? analytic.student._id
				: analytic.student
		] = analytic;
	}
	return res.status(200).json({
		status: 'ok',
		analytics: analytics,
	});
};

module.exports.analytics = (req, res) => {
	if (!req.user.teacher_id) {
		return res.status(401).json({
			status: 'error',
			message: "You don't have permission for this",
		});
	}

	Program.countDocuments({ _id: req.body.program }, function(err, count) {
		if (err) {
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		}
		// Short circuits to returning error if the provided program isn't in the DB
		if (count == 0) {
			return res.status(404).json({
				status: 'error',
				message: 'Unable to find program ' + req.body.program,
			});
		}

		if (req.body.focus_items) {
			Analytic.find()
				.where('program')
				.equals(req.body.program)
				.populate('student')
				.where('focus_item')
				.in(req.body.focus_items)
				.populate('focus_item')
				.then(function(analytics) {
					let cleansed_analytics = [];
					for (a of analytics) {
						if (
							mongoose.Types.ObjectId(a.student.teacher).equals(
								req.user._id
							)
						) {
							cleansed_analytics.push(a);
						}
					}
					return res.status(200).json({
						status: 'ok',
						focus_items: sortAnalyticsIntoFocusItemStructure(
							cleansed_analytics
						),
					});
				})
				.catch(err => {
					return res.status(500).json({
						status: 'error',
						error: err,
						message:
							'An unexpected internal server error has occurred!',
					});
				});
		} else if (req.body.focus_item) {
			Analytic.find()
				.where('program')
				.equals(req.body.program)
				.populate('student')
				.where('focus_item')
				.equals(req.body.focus_item)
				.populate('focus_item')
				.then(function(analytics) {
					let cleansed_analytics = [];
					for (a of analytics) {
						if (
							mongoose.Types.ObjectId(a.student.teacher).equals(
								req.user._id
							)
						) {
							cleansed_analytics.push(a);
						}
					}

					return res.status(200).json({
						status: 'ok',
						focus_items: sortAnalyticsIntoFocusItemStructure(
							cleansed_analytics
						),
					});
				})
				.catch(err => {
					return res.status(500).json({
						status: 'error',
						error: err,
						message:
							'An unexpected internal server error has occurred!',
					});
				});
		} else {
			Analytic.find()
				.where('program')
				.equals(req.body.program)
				.populate('student')
				.populate('focus_item')
				.then(function(analytics) {
					let cleansed_analytics = [];
					for (a of analytics) {
						if (
							mongoose.Types.ObjectId(a.student.teacher).equals(
								req.user._id
							)
						) {
							cleansed_analytics.push(a);
						}
					}

					return res.status(200).json({
						status: 'ok',
						focus_items: sortAnalyticsIntoFocusItemStructure(
							cleansed_analytics
						),
					});
				})
				.catch(err => {
					// console.log(err)
					return res.status(500).json({
						status: 'error',
						error: err,
						message:
							'An unexpected internal server error has occurred!',
					});
				});
		}
	});
};

function sortAnalyticsIntoFocusItemStructure(analytics) {
	const focus_items_set = new Set();
	for (a of analytics) {
		if (!focus_item_list_contains(a.focus_item, focus_items_set)) {
			fc = a.focus_item.toObject();
			fc['analytics'] = [];
			focus_items_set.add(fc);
		}
	}

	const focus_items_list = Array.from(focus_items_set);
	const focus_items_return_list = new Array();

	for (fc of focus_items_list) {
		for (an of analytics) {
			if (
				mongoose.Types.ObjectId(an.focus_item._id).equals(
					focus_item._id
				)
			) {
				an.focus_item = an.focus_item._id;
				fc.analytics.push(an);
			}
		}

		focus_items_return_list.push(fc);
	}
	return focus_items_return_list;
}

function focus_item_list_contains(fc, fc_list) {
	for (f of fc_list) {
		if (mongoose.Types.ObjectId(fc._id).equals(f._id)) {
			return true;
		}
	}
	return false;
}
