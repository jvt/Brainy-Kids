const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
		// 3-character unique ID for this teacher
		teacher_id: {
			type: String,
			required: true,
            minlength: 3
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

		// Pointer to password reset model
		password_reset_model: {
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'PasswordReset',
			required: false
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Teacher', schema);
