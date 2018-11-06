const mongoose = require('mongoose');
const Analytic = require('mongoose').model('Analytic');
const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');

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
