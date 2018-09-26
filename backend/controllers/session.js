'use strict';
const consts = require('../helpers/consts');
const path = require('path');
const Teacher = require('mongoose').model('Teacher');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function hash(password){
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

    new Teacher({name:name, email:email, teacher_id:id, password:passwordHash})
                .save().then(teacher => {
                    //Duplicate created with same id due to race condition
                    //Removes and retries after random delay
                    if(Teacher.countDocuments({teacher_id:id}) > 1){
                        Teacher.deleteOne({email:email});
                        setTimeout(function(){createNewTeacher(name, email, passwordHash, res)}, Math.random() * 5);
                    } else {
                        Teacher.findOne({email}).then(teacher => {
                            return res.status(200).json({
                                status: 'success',
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
