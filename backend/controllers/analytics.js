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
                status: 'success',
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
    var students = [];
    if(!req.user.teacher_id){
        return res.status(401).json({
            status: 'error',
            message: "You don't have permission for this"
        });
    }
    var analytics = {};
    if(req.body.student || req.body.students){
        if(req.body.student){
            students.push(mongoose.Types.ObjectId(req.body.student));
        }else{
            students = req.body.students.map(mongoose.Types.ObjectId);
        }
        for(student of students){
            var studentObject = await Student.findById(student);
            if(studentObject){
                if(req.user._id.toString() != studentObject.teacher.toString()){
                    return res.status(401).json({
                        status: 'error',
                        message: "You don't have permission for this"
                    });
                }
                analytics[student.toString()] = null;
            }else{
                analytics[student.toString()] = {error: "Student not found"};
            }
        }
    }else {
        students = (await Student.find({teacher:req.user._id})).map((student) => student._id);
        for(student of students){
            analytics[student] = null;
        }
    }

    var analyticsArray = await Analytic.find({student:{$in:students}, focus_item:req.body.focus_item});
    for(analytic of analyticsArray){
        analytics[analytic.student] = analytic;
    }
    return res.status(200).json({
        status: 'success',
        analytics: analytics
    });
}

module.exports.analytics = (req, res) => {
	
	// If the request was made with a student's token
	if (req.user.student_id) {
		console.log('Student tried to login as teacher')
		return res.status(401).json();
	}
	console.log(req.body)
	var program_id;
	try {
		program_id = mongoose.Types.ObjectId(req.body.program);
	}
	catch (err) {
		console.log(err)
		return res.status(500).json({
			status: 'error',
			error: err,
			message: 'An unexpected internal server error has occurred!',
		});
	}
	// console.log(program_id == req.body.program)
	console.log("I ran!")
	Program.countDocuments({ _id: req.body.program }, function (err, count) {
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
				.populate('program')
				.where('program._id').equals(program_id)
				.populate('student')
				.where('student.teacher').equals(req.user._id)
				.where('focus_item').in(req.body.focus_items)
				.populate('focus_item')
				.then(function (analytics) {
					return res.status(200).json({
						status: 'ok',
						focus_items: sortAnalyticsIntoFocusItemStructure(analytics)
					});
				})
				.catch(err => {
					return res.status(500).json({
						status: 'error',
						error: err,
						message: 'An unexpected internal server error has occurred!',
					});
				});
		} else if (req.body.focus_item) {
			Analytic.find()
				.populate('program')
				.where('program._id').equals(program_id)
				.populate('student')
				.where('student.teacher').equals(req.user._id)
				.where('focus_item').equals(req.body.focus_item)
				.populate('focus_item')
				.then(function (analytics) {
					return res.status(200).json({
						status: 'ok',
						focus_items: sortAnalyticsIntoFocusItemStructure(analytics)
					});
				})
				.catch(err => {
					return res.status(500).json({
						status: 'error',
						error: err,
						message: 'An unexpected internal server error has occurred!',
					});
				});
		} else {
			Analytic.find()
				.where('program').equals(req.body.program)
				.populate('student')
				
				// .populate('student.teacher')
				//.where('student.teacher')
				// .exists('student')
				// .where('student.teacher').equals(req.user._id)
				.populate('focus_item')
				// .where('focus_item.unit', 'test_unit')
				// .lean()
				.then(function (analytics) {
					//console.log(analytics);
					//console.log(req.user._id);
					let cleansed_analytics = [];
					for (a of analytics) {


						if (mongoose.Types.ObjectId(a.student.teacher).equals(req.user._id)){
							cleansed_analytics.push(a)
							// console.log('1: ' + mongoose.Types.ObjectId(a.student.teacher).equals(mongoose.Types.ObjectId(req.user._id)))
							// console.log('2: ' + mongoose.Types.ObjectId(a.student.teacher).equals(req.user._id))
						}
					}
					// console.log(analytics.length);
					return res.status(200).json({
						status: 'ok',
						focus_items: sortAnalyticsIntoFocusItemStructure(cleansed_analytics)
					});
				})
				.catch(err => {
					console.log(err)
					return res.status(500).json({
						status: 'error',
						error: err,
						message: 'An unexpected internal server error has occurred!',
					});
				});
		}
	});
};

function sortAnalyticsIntoFocusItemStructure(analytics) {
	// console.log(analytics)
	// const focus_items_set = new Set();
	// for (a of analytics) {
	// 	focus_items_set.add(a.focus_item);
	// }

	// const focus_items_list = Array.from(focus_items_set);
	// const focus_items_return_list = new Array();
	// for (i in focus_items_set.values()) {
	// 	var focus_item = focus_items_list[i];
	// 	focus_item['analytics'] = [];
	// 	for (j in analytics) {
	// 		var analytic = analytics[j];
	// 		if (analytic.focus_item._id == focus_item._id) {
	// 			analytic.focus_item = analytic.focus_item._id;
	// 			focus_item.analytics.push(analytic);
	// 		}
	// 	}
	// 	focus_items_return_list.push(focus_item)
	// }
	// return focus_items_list;

	const focus_items_set = new Set();
	for (a of analytics) {
		if (!focus_item_list_contains(a.focus_item, focus_items_set)) {
			fc = a.focus_item.toObject()
			fc['analytics'] = [];
			focus_items_set.add(fc);
		}
		
	}

	const focus_items_list = Array.from(focus_items_set);
	const focus_items_return_list = new Array();
	for (fc of focus_items_list) {
		// console.log(fc)
		// fc['analytics'] = [];
		for (an of analytics) {
			// console.log(an.focus_item._id + ' : ' + focus_item._id + ' : '+  mongoose.Types.ObjectId(an.focus_item._id).equals(focus_item._id))
			if (mongoose.Types.ObjectId(an.focus_item._id).equals(focus_item._id)) {
				console.log("Pushing: " + an)
				an.focus_item = an.focus_item._id;
				fc.analytics.push(an);

			}
		}

		focus_items_return_list.push(fc);
	}

	return focus_items_return_list
}

function focus_item_list_contains(fc, fc_list) {
	for (f of fc_list) {
		if (mongoose.Types.ObjectId(fc._id).equals(f._id)) {
			return true
		}
	}
	return false
}