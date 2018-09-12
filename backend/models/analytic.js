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
        
        /**
         * The required logic below should communicate:
         * There are two pairs of stats. Correct_on and time_spent are one pair
         * time watching and total video time is another pair.
         * Exactly one pair must be specified, meaning both fields must be non-null
         */


        // How many guesses needed until the correct answer was gotten?
        correct_on: {
            type: Number,
            required: function() {return (this.time_spent !== null) || (this.time_watching !== null && this.total_video_time !== null)},
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
            required: function() {return (this.time_watching !== null) ||  (this.correct_on !== null && this.time_spent !== null)},
        }
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Analytic', schema);
