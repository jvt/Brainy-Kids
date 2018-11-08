require('dotenv').config();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const Student = require('mongoose').model('Student');
const Teacher = require('mongoose').model('Teacher');

const consts = require('./helpers/consts');

module.exports.jwtOptions = () => {
	return (opts = {
		jwtFromRequest: ExtractJwt.fromExtractors([
			ExtractJwt.fromAuthHeaderAsBearerToken(), // HEADER (Authorization: Bearer <JWT token>)
		]),
		secretOrKey: process.env.JWT_SECRET, // Secret key used for signing the token
	});
};

module.exports.initialize = app => {
	const strategy = new JwtStrategy(
		module.exports.jwtOptions(),
		(payload, next) => {
			if (payload.type === consts.STUDENT) {
				/**
				 If this token is for a student, we query the Student model for that _id
				 **/
				Student.findById(payload.id)
					.then(student => next(null, student ? student : false))
					.catch(err => {
						console.error(err);
						return next(err, false);
					});
			} else if (payload.type === consts.TEACHER) {
				/**
				 If this token is for a teacher, we query the Teacher model for that _id
				 **/
				Teacher.findById(payload.id)
					.then(teacher => {
						console.log(teacher);
						return next(null, teacher ? teacher : false);
					})
					.catch(err => {
						console.error(err);
						return next(err, false);
					});
			} else {
				/**
			 	If this token is for a teacher, we query the Teacher model for that id
			 	**/
				return next('Invalid token type', false);
			}
		}
	);

	passport.use(strategy);

	app.use(passport.initialize());

	return passport;
};
