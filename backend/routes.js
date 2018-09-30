'use strict';
const controllers = require('./controllers');

// We disable sessions since we want to validate the token on each request
const PASSPORT_OPTIONS = { session: false };

module.exports = (app, passport) => {
	/**
	 * The following code is used on routes which we wish to protect via JWTs.
	 * It only verifies that valid token is provided, for a valid teacher or
	 * student, it doesn't verify that a student can access only certain routes.
	 * Additional validation is necessary for that.
	 *
	 * Middleware: passport.authenticate('jwt', PASSPORT_OPTIONS)
	 */
	app.post('/api/session/login', [], controllers.session.login);
	app.post('/api/session/register', [], controllers.session.newTeacher);
	app.post('/api/session/student', [], controllers.session.loginStudent);

	app.get('/status', [], controllers.static.status);

	/**
	 * Program Routes
	 */
	app.get('/api/programs', [], controllers.program.getAll);
	app.get('/api/program/:id', [], controllers.program.getOne);
	app.post('/api/program', [], controllers.program.create);
	app.put('/api/program/:id', [], controllers.program.update);
	app.delete('/api/program/:id', [], controllers.program.deleteOne);

	/**
	 * Focus Item Routes
	 */
	app.get('/api/focusitem', [], controllers.focusitem.getAll);
	app.get('/api/focusitem/:id', [], controllers.focusitem.getOne);
	app.post('/api/focusitem', [], controllers.focusitem.create);
	app.put('/api/focusitem/:id', [], controllers.focusitem.update);
	app.delete('/api/focusitem/:id', [], controllers.focusitem.deleteOne);

	/**
	 * Student Routes
	 */
	app.get('/api/student', [], controllers.student.getAll);
	app.get('/api/student/:id', [], controllers.student.getOne);
	app.post('/api/student', [], controllers.student.create);
	app.put('/api/student/:id', [], controllers.student.update);
	app.delete('/api/student/:id', [], controllers.student.deleteOne);

	/**
	 * Analytics Routes
	 */
	app.post('/api/analytics/hearatale', [], controllers.analytics.hearatale);
	app.post(
		'/api/analytics/application',
		[],
		controllers.analytics.application
	);

	// Render React page
	app.get('/*', [], controllers.static.getAll);
};
