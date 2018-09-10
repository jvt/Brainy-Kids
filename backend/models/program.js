const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
		// Name of the program
		name: {
			type: String,
			required: true,
		},
		// Optional String briefly desciribing the program
		description: {
			type: String,
			required: false,
		},
        type: {
            type: String,
            required: true,
            enum: ['mobile game', 'website']
        }
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Program', schema);
