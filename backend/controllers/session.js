const Teacher = require('mongoose').model('Teacher');
var bcrypt = require('bcryptjs');

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
};

function unexpectedError(error) {
    return res.status(500).json({
        status: 'error',
        error: err,
        message: 'An unexpected internal server error has occurred!',
    });
})

module.exports.new = {
    teacher: (req, res) => {
        Teacher.findOne({email:req.body.email}).then(teacher => {
            if(teacher) {
                res.status(409).json({
                    status: 'error',
                    message: 'Teacher with that email already exists',
                });
            } else {
                var id = ++maxId;
                new Teacher({name:req.body.name, email:req.body.email, teacher_id:id, password:hash(req.body.password)})
                    .save().then(teacher => {
                        return res.status(200).json({
                            status: 'success',
                        })
                    }).catch(unexpectedError);
            }
        }).catch(unexpectedError);
    }
}
