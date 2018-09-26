'use strict';
const consts = require('../helpers/consts');
const path = require('path');
const Teacher = require('mongoose').model('Teacher');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function hash(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

var maxId = Teacher.findOne({})
    .sort({ teacher_id: 'desc' })
    .exec((err, teacher) => {
        if (teacher) {
            maxId = teacher.teacher_id;
        } else {
            maxId = 0;
        }
    });

function unexpectedError(error, res) {
    console.log(error);
    return res.status(500).json({
        status: 'error',
        error: error,
        message: 'An unexpected internal server error has occurred!',
    });
}

function createNewTeacher(name, email, passwordHash, res) {
    var id = ++maxId;
    new Teacher({
        name: name,
        email: email,
        teacher_id: id,
        password: passwordHash,
    })
        .save()
        .then(teacher => {
            //Duplicate created with same id due to race condition
            //Removes and retries after random delay
            if (Teacher.countDocuments({ teacher_id: id }) > 1) {
                Teacher.deleteOne({ email: email });
                setTimeout(function() {
                    createNewTeacher(name, email, passwordHash, res);
                }, Math.random() * 5);
            } else {
                return res.status(200).json({
                    status: 'success',
                    teacher,
                    token: jwt.sign(
                        { type: consts.TEACHER, id: teacher._id },
                        process.env.JWT_SECRET
                    ),
                });
            }
        })
        .catch(unexpectedError, res);
}

module.exports.newTeacher = (req, res) => {
    Teacher.findOne({ email: req.body.email.toLowerCase() })
        .then(teacher => {
            if (teacher) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Teacher with that email already exists',
                });
            } else {
                return createNewTeacher(
                    req.body.name,
                    req.body.email.toLowerCase(),
                    hash(req.body.password),
                    res
                );
            }
        })
        .catch(error => unexpectedError(error, res));
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
