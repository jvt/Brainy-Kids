const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
		// 3-character unique ID for this teacher
		teacher_id: {
			type: String,
			required: true,
		},
		// Teacher's Full name (First + Last)
		name: {
			type: String,
			required: true,
		},
		// Teacher's Email for login
		email: {
			type: String,
			required: true,
		},
		// Password hash
		password: {
			type: String,
			required: true,
            select: false
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Teacher', schema);
