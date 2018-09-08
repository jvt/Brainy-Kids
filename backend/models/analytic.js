const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
		// reference to the focus item
		focus_item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Focus_Item',
			required: true,
		},
		// Reference to the program
		program: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Program',
			required: true,
		},
        // How many guesses needed until the correct answer was gotten?
        correct_on: {
            type: Number,
            required: false,
        },
        //time spent on this item
        time_spent: {
            type: Number,
            required: false,
        },
        //time watching in millis. applicable to watching videos
        time_watching: {
            type: Number,
            required: false,
        },
        //length of video in millis. applicable to watching videos
        total_video_time: {
            type: Number,
            required: false,
        }
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Analytic', schema);
