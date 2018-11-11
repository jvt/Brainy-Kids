const expect = require('chai').expect;
const mongoose = require('mongoose');
const Teacher = require('../../../backend/models/teacher');

describe('backend/models/teacher', function() {
	it('should be invalid if teacher_id is empty', function(done) {
		const t = new Teacher();
		t.validate(function(err) {
			expect(err.errors.teacher_id).to.exist;
			done();
		});
	});
	it('should be valid if teacher_id is a string', function(done) {
		const t = new Teacher({
			teacher_id: '010',
		});
		t.validate(function(err) {
			expect(err.errors.teacher_id).to.not.exist;
			done();
		});
	});
	it('should be invalid if teacher_id is not a string', function(done) {
		const t = new Teacher({
			teacher_id: {},
		});
		t.validate(function(err) {
			expect(err.errors.teacher_id).to.exist;
			done();
		});
	});
	it('should be invalid if name is empty', function(done) {
		const t = new Teacher();
		t.validate(function(err) {
			expect(err.errors.name).to.exist;
			done();
		});
	});
	it('should be invalid if name is not a string', function(done) {
		const t = new Teacher({
			name: {},
		});
		t.validate(function(err) {
			expect(err.errors.name).to.exist;
			done();
		});
	});
	it('should be valid if name is a string', function(done) {
		const t = new Teacher({
			name: 'George Burdell',
		});
		t.validate(function(err) {
			expect(err.errors.name).to.not.exist;
			done();
		});
	});
	it('should be invalid if email is empty', function(done) {
		const t = new Teacher();
		t.validate(function(err) {
			expect(err.errors.email).to.exist;
			done();
		});
	});
	it('should be invalid if email is not a string', function(done) {
		const t = new Teacher({
			email: [],
		});
		t.validate(function(err) {
			expect(err.errors.email).to.exist;
			done();
		});
	});
	it('should be valid if email is a string', function(done) {
		const t = new Teacher({
			email: 'gburdell@gatech.edu',
		});
		t.validate(function(err) {
			expect(err.errors.email).to.not.exist;
			done();
		});
	});
});
