const mongoose = require('mongoose');

const mongoDB =
	process.env.NODE_ENV === 'testing'
		? 'mongodb://127.0.0.1/brainykids_testing'
		: process.env.MONGODB_URI;

if (!mongoDB) {
	console.error('No MONGODB_URI found in environment');
	return;
}

mongoose.connect(
	mongoDB,
	{ useNewUrlParser: true }
);

// Get the default connection
const db = mongoose.connection;

/**
 * Place all Collection schemas here
 */
require('./models/teacher');
require('./models/focus_item');
require('./models/analytic');
require('./models/program');
require('./models/student');
require('./models/password_reset');

// Bind connection to error event (to get notification of connection errors)
db.on('error', err => {
	console.error(`A MongoDB connection error has occurred.`);
	console.error(err);
	console.error(
		`Application server is exiting with non-zero exit code to ensure server is removed from cluster`
	);
	return process.exit(1);
});

module.exports = db;
