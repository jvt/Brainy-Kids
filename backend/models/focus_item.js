const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
        //Name of the focus item
        name: {
            type: String,
            required: true,
        },
        // Reference to the program
		program: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Program',
			required: true,
		},
        // Unit this focus item is in
        unit: {
            type: String,
            required: false,
        },
        // Subunit this focus item is in
        sub_unit: {
            type: String,
            required: false,
        }
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Focus_Item', schema);
