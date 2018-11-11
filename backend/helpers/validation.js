module.exports = {
    validate: function(val) {
        return function(req, res, next) {
            const errors = val(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            } else {
                next();
            }
        }
    }
}
