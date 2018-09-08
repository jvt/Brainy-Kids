'use strict';
const path = require('path');

module.exports.status = (req, res) => {
	return res.status(200).json({
		status: 'ok',
	});
};

module.exports.getAll = (req, res) => {
	return res.sendFile(path.join(__dirname, '../../', 'public/index.html'));
};
