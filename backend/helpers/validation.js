module.exports = {
    validate: function(val) {
        return function(req, res, next) {
            const errors = val(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ status: 'error', errors: errors.array() });
            } else {
                next();
            }
        };
    },
};
