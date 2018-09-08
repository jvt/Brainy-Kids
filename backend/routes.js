'use strict';
const controllers = require('./controllers');

module.exports = app => {
	app.get('/status', controllers.static.status);

	// Render React page
	// app.get('/*', (req, res) => {
	//
	// 	res.sendFile(path.join(__dirname, '../', 'public/index.html')); // For React/Redux
	// });
	app.get('/*', controllers.static.getAll);
};

// module.exports = controllers.static.routes;
