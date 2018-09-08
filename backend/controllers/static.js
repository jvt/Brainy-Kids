'use strict';
const path = require('path');

module.exports.status = (req, res) => {
	return res.status(200).json({
		status: 'ok',
	});
};

module.exports.routes = app => {
	app.get('/status', this.status);

	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, '../../', 'public/index.html'));
	});
};
