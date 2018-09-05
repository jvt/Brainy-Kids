const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
		// 3-character unique ID for this student
		student_id: {
			type: String,
			required: true,
		},
		// Reference to teacher
		teacher: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		// Defines if this student has been deleted or not. true = deleted
		deleted: {
			type: Boolean,
			default: false
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Student', schema);
