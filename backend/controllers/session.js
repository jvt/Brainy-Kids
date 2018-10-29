'use strict';
const consts = require('../helpers/consts');
const path = require('path');
const Teacher = require('mongoose').model('Teacher');
const Student = require('mongoose').model('Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function hash(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

async function maxId(){
    var toRet = await Teacher.findOne({}).sort({teacher_id:'desc'});
    if(toRet){
        return toRet.teacher_id;
    }else{
        return 0;
    }
}

function unexpectedError(error, res) {
    console.log(error);
    return res.status(500).json({
        status: 'error',
        error: error,
        message: 'An unexpected internal server error has occurred!',
    });
};

async function createNewTeacher(name, email, passwordHash, res){
    var mId = parseInt(await maxId());
    var id = mId + 1;

    new Teacher({name:name, email:email, teacher_id:("00" + id).slice(-3), password:passwordHash})
                .save().then(teacher => {
                    //Duplicate created with same id due to race condition
                    //Removes and retries after random delay
                    if(Teacher.countDocuments({teacher_id:id}) > 1){
                        Teacher.deleteOne({email:email});
                        setTimeout(function(){createNewTeacher(name, email, passwordHash, res)}, Math.random() * 5);
                    } else {
                        Teacher.findOne({email}).then(teacher => {
                            return res.status(200).json({
                                status: 'ok',
                                teacher,
                                token:jwt.sign({type:consts.TEACHER, id:teacher.id}, process.env.JWT_SECRET)
                            });
                        });
                    }
                }).catch(unexpectedError, res);

}

module.exports.newTeacher =  (req, res) => {
    Teacher.findOne({email:req.body.email.toLowerCase()}).then(teacher => {
        if(teacher) {
            return res.status(409).json({
                status: 'error',
                message: 'Teacher with that email already exists',
            });
        } else {
            return createNewTeacher(req.body.name, req.body.email.toLowerCase(), hash(req.body.password), res);
        }
    }).catch(error => unexpectedError(error, res));
};

module.exports.login = async (req, res) => {
    const INCORRECT_MESSAGE = 'Your email / password combination is incorrect.';

    const teacher = await Teacher.findOne({
        email: req.body.email.toLowerCase(),
    })
        .select('+password')
        .exec()
        .catch(error => unexpectedError(error, res));

    if (!teacher) {
        // We have a random delay to prevent time-attacks
        setTimeout(() => {
            return res.status(403).json({
                status: 'error',
                message: INCORRECT_MESSAGE,
            });
        }, Math.random() * 100);
        return;
    }

    const passwordsEqual = await bcrypt.compare(
        req.body.password,
        teacher.password
    );

    if (!passwordsEqual) {
        return res.status(401).json({
            status: 'error',
            message: INCORRECT_MESSAGE,
        });
    }

    const payload = {
        id: teacher._id,
        type: consts.TEACHER,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);

    const cleanTeacher = await Teacher.findById(teacher._id).catch(error =>
        unexpectedError(error, res)
    );

    return res.json({
        status: 'ok',
        token: jwtToken,
        teacher: cleanTeacher,
    });
};

module.exports.loginStudent = async (req, res) => {
    const INCORRECT_MESSAGE = 'Your id / password combination is incorrect.';

    const teacher = await Teacher.findOne({
        teacher_id: req.body.student_id.substring(0, 3)
    });
    
    if (!teacher) {
        // We have a random delay to prevent time-attacks
        setTimeout(() => {
            if(!teacher){
                return res.status(403).json({
                    status: 'error',
                    message: INCORRECT_MESSAGE,
                });
            }
        }, Math.random() * 100);
        return;
    }

    const student = await Student.findOne({teacher:teacher._id, student_id:req.body.student_id.substring(3)});

    if (!student) {
        // We have a random delay to prevent time-attacks
        console.log("Bad student");
        setTimeout(() => {
            return res.status(403).json({
                status: 'error',
                message: INCORRECT_MESSAGE,
            });
        }, Math.random() * 100);
        return;
    }

    const payload = {
        id: student._id,
        type: consts.STUDENT,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({
        status: 'ok',
        token: jwtToken,
        student: student
    });
};

module.exports.getInfo = async (req, res) => {
    return res.status(200).json(await Teacher.findById(req.user._id));
};

module.exports.getStudentInfo = async (req, res) => {
    return res.status(200).json(await Student.findById(req.user._id));
};
