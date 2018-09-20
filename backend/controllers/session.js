'use strict';
const path = require('path');
const Teacher = require('mongoose').model('Teacher');
var bcrypt = require('bcrypt');

function hash(password){
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

var maxId = Teacher.findOne({}).sort({teacher_id:'desc'}).exec((err, teacher) => {
    if(teacher){
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
};

function createNewTeacher(name, email, passwordHash, res){
    var id = ++maxId;
    console.log("Using id:" + id);
    new Teacher({name:name, email:email, teacher_id:id, password:passwordHash})
                .save().then(teacher => {
                    //Duplicate created with same id due to race condition
                    //Removes and retries after random delay
                    if(Teacher.countDocuments({teacher_id:id}) > 1){
                        Teacher.deleteOne({email:email});
                        setTimeout(function(){createNewTeacher(name, email, passwordHash, res)}, Math.random() * 5);
                    } else {
                        return res.status(200).json({
                            status: 'success',
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
