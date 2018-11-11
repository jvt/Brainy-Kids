const expect = require('chai').expect;
const mongoose = require('mongoose');
const Student = require('../../../backend/models/student');

describe('backend/models/student', function() {
	it('should be invalid if student_id is empty', function(done) {
		const s = new Student();
		s.validate(function(err) {
			expect(err.errors.student_id).to.exist;
			done();
		});
	});
	it('should be valid if student_id is a string', function(done) {
		const s = new Student({
			student_id: '010',
		});
		s.validate(function(err) {
			expect(err.errors.student_id).to.not.exist;
			done();
		});
	});
	it('should be invalid if student_id is not a string', function(done) {
		const s = new Student({
			student_id: {},
		});
		s.validate(function(err) {
			expect(err.errors.student_id).to.exist;
			done();
		});
	});
	it('should be invalid if teacher is empty', function(done) {
		const s = new Student();
		s.validate(function(err) {
			expect(err.errors.teacher).to.exist;
			done();
		});
	});
	it('should be valid if teacher is an ObjectID', function(done) {
		const s = new Student({
			teacher: mongoose.Types.ObjectId(),
		});
		s.validate(function(err) {
			expect(err.errors.teacher).to.not.exist;
			done();
		});
	});
	it('should be invalid if teacher is not an ObjectID', function(done) {
		const s = new Student({
			teacher: 'George Burdell',
		});
		s.validate(function(err) {
			expect(err.errors.teacher).to.exist;
			done();
		});
	});
});
