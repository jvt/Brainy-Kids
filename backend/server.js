'use strict';

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../', '.env') });

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../', 'public')));

// Render React page
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../', 'public/index.html')); // For React/Redux
});

app.listen(PORT, error => {
	error
		? console.error(error)
		: console.info(
				`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`
		  );
});

module.exports = app;
