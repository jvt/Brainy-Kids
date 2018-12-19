'use strict';

const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./backend/db');

const passport = require('./backend/passport').initialize(app);

require('./backend/routes')(app, passport);

app.listen(PORT, error => {
	error
		? console.error(error)
		: console.info(
				`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`
		  );
});

module.exports = app;
