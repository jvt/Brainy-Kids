const Teacher = require('mongoose').model('Teacher');
const Student = require('mongoose').model('Student');

module.exports.getAll = (req, res) => {
    Teacher.find({})
        .then(teacher => {
            return res.status(200).json({
                status: 'ok',
                teacher: teacher ? teacher : [], // Ensure we always at the bare minimum send back an empty array
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

module.exports.getOne = (req, res) => {
    Teacher.findById(req.params.id)
        .then(teacher => {
            return res.status(200).json({
                status: 'ok',
                teacher: teacher,
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

module.exports.update = (req, res) => {
    Teacher.findById(req.params.id)
        .then(async teacher => {
            if (!teacher) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Teacher not found',
                });
            }

            // Update the student_id if the body request contains a student_id
            if (req.body.teacher_id) {
                teacher.teacher_id = req.body.teacher_id;
            }

            // Update the student if the body request contains deleted
            if (req.body.name) {
                teacher.deleted = req.body.deleted;
            }

            // Update the unit if the body request contains a unit
            if (req.body.email) teacher.email = req.body.email;

            if (req.body.password) teacher.password = req.body.password;

            teacher
                .save()
                .then(updatedTeacher => {
                    return res.status(200).json({
                        status: 'ok',
                        teacher: updatedStudent,
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
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                error: err,
                message: 'An unexpected internal server error has occurred!',
            });
        });
};

module.exports.deleteOne = (req, res) => {
    Teacher.findByIdAndRemove(req.params.id)
        .then(student => {
            return res.status(200).json({
                status: 'ok',
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

module.exports.getStudents = async (req, res) => {
    const { id } = req.params;

    if (id !== req.user._id.toString()) {
        return res.status(403).json({
            status: 'error',
            message: 'Unauthorized request',
        });
    }

    const students = await Student.find({
        teacher: id,
    });

    return res.status(200).json({
        status: 'ok',
        students: students,
    });
};
