const Analytic = require('mongoose').model('Analytic');

module.exports.hearatale = (req, res) => {
    new Analytic({
        student: req.body.student,
        program: req.body.program,
        focus_item: req.body.focus_item,
        time_watching: req.body.time_watching,
        total_video_time: req.body.total_video_time
    })
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

module.exports.application = (req, res) => {
    
    new Analytic({
        student: req.body.student,
        program: req.body.program,
        focus_item: req.body.focus_item,
        correct_on: req.body.correct_on,
        time_spent: req.body.time_spent
    })
        .then(analytic => {
        if (req.body.created_at) { 
            analytic.created_at = req.body.created_at;
        }
        if (req.body.updated_at) { 
            analytic.updated_at = req.body.updated_at;
        }
    })
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
