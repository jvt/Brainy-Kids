'use strict';

const path = require('path');

// const controllers = require('./controllers');

module.exports = (app, passport) => {
	// Render React page
	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, '../', 'public/index.html')); // For React/Redux
	});
};
