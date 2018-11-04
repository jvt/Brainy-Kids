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
    app.get('/api/session/info', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.session.getInfo);
    app.get('/api/session/studentinfo', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.session.getStudentInfo);

	app.get('/status', [], controllers.static.status);

	/**
	 * Program Routes
	 */
	app.get('/api/programs', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.program.getAll);
	app.get('/api/program/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.program.getOne);
	app.get('/api/program/:id/focusitem', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.program.getFocusItemByProgram);
	app.post('/api/program', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.program.create);
	app.put('/api/program/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.program.update);
	app.delete('/api/program/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.program.deleteOne); 

	/**
	 * Focus Item Routes
	 */
	app.get('/api/focusitem', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.focusitem.getAll);
	app.get('/api/focusitem/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.focusitem.getOne);
	app.post('/api/focusitem', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.focusitem.create);
	app.put('/api/focusitem/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.focusitem.update);
	app.delete('/api/focusitem/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.focusitem.deleteOne);

	/**
	 * Student Routes
	 */
	app.get('/api/student', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.student.getAll);
	app.get('/api/student/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.student.getOne);
	app.post('/api/student', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.student.create);
	app.put('/api/student/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.student.update);
	app.delete('/api/student/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.student.deleteOne);

	app.get('/api/teacher', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.teacher.getAll);
	app.get('/api/teacher/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.teacher.getOne);
	app.put('/api/teacher/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.teacher.update);
	app.delete('/api/teacher/:id', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.teacher.deleteOne);

	/**
	 * Analytics Routes
	 */
	app.post('/api/analytics/hearatale', [passport.authenticate('jwt', PASSPORT_OPTIONS)], controllers.analytics.hearatale);
	app.post(
		'/api/analytics/application',
		[passport.authenticate('jwt', PASSPORT_OPTIONS)],
		controllers.analytics.application
	);

	app.get('/api/*', [], controllers.static.apiError);

	// Render React page
	app.get('/*', [], controllers.static.getAll);
};
