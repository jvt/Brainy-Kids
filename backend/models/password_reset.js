const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
        // Uses Mongo generated UID for lookup

        // Starts out as false, turn to true after its used
        expired: {
			type: Boolean,
			required: true
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('PasswordReset', schema);
