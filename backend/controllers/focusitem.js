const Focusitem = require('mongoose').model('Focus_Item');

module.exports.getAll = (req, res) => {
    Focusitem.find({})
        .then(focusitems => {
            return res.status(200).json({
                status: 'success',
                focusitems: focusitems ? focusitems : [], // Ensure we always at the bare minimum send back an empty array
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
    Focusitem.findById(req.params.id)
        .then(focusitem => {
            return res.status(200).json({
                status: 'success',
                focusitem: focusitem,
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

module.exports.create = (req, res) => {
    new Focusitem({
        name: req.body.name,
        program: req.body.program,
        unit: req.body.unit,
        sub_unit: req.body.subunit
    })
        .save()
        .then(focusitem => {
            return res.status(200).json({
                status: 'success',
                focusitem: focusitem,
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
    Focusitem.findById(req.params.id)
        .then(focusitem => {
            if (!focusitem) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Focus Item not found',
                });
            }

            // Update the name if the body request contains a name
            focusitem.name = req.body.name ? req.body.name : focusitem.name;

            // Update the program if the body request contains a program
            focusitem.program = req.body.program
                ? req.body.program
                : focusitem.program;

            // Update the unit if the body request contains a unit
            focusitem.unit = req.body.unit ? req.body.unit : focusitem.unit;

            // Update the subunit if the body request contains a subunit
            focusitem.subunit = req.body.subunit ? req.body.subunit : focusitem.subunit;

            focusitem
                .save()
                .then(updatedFocusitem => {
                    return res.status(200).json({
                        status: 'success',
                        focusitem: updatedFocusitem,
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
    Focusitem.findByIdAndRemove(req.params.id)
        .then(focusitem => {
            return res.status(200).json({
                status: 'success',
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
