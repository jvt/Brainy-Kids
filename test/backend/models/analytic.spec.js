const expect = require('chai').expect;
const mongoose = require('mongoose');
const Analytic = require('../../../backend/models/analytic');

describe('backend/models/analytic', function() {
	it('should be invalid if student is empty', function(done) {
		const a = new Analytic();
		a.validate(function(err) {
			expect(err.errors.student).to.exist;
			done();
		});
	});
	it('should be valid if student is an ObjectID', function(done) {
		const a = new Analytic({
			student: mongoose.Types.ObjectId(),
		});
		a.validate(function(err) {
			expect(err.errors.student).to.not.exist;
			done();
		});
	});
	it('should be valid if student is not an ObjectID', function(done) {
		const a = new Analytic({
			student: 'test',
		});
		a.validate(function(err) {
			expect(err.errors.student).to.exist;
			done();
		});
	});
	it('should be invalid if focus_item is empty', function(done) {
		const a = new Analytic();
		a.validate(function(err) {
			expect(err.errors.focus_item).to.exist;
			done();
		});
	});
	it('should be valid if focus_item is an ObjectID', function(done) {
		const a = new Analytic({
			focus_item: mongoose.Types.ObjectId(),
		});
		a.validate(function(err) {
			expect(err.errors.focus_item).to.not.exist;
			done();
		});
	});
	it('should be valid if focus_item is not an ObjectID', function(done) {
		const a = new Analytic({
			focus_item: 'test',
		});
		a.validate(function(err) {
			expect(err.errors.focus_item).to.exist;
			done();
		});
	});
	it('should be invalid if program is empty', function(done) {
		const a = new Analytic();
		a.validate(function(err) {
			expect(err.errors.program).to.exist;
			done();
		});
	});
	it('should be valid if program is an ObjectID', function(done) {
		const a = new Analytic({
			program: mongoose.Types.ObjectId(),
		});
		a.validate(function(err) {
			expect(err.errors.program).to.not.exist;
			done();
		});
	});
	it('should be valid if program is not an ObjectID', function(done) {
		const a = new Analytic({
			program: 'test',
		});
		a.validate(function(err) {
			expect(err.errors.program).to.exist;
			done();
		});
	});
	it('should require time_spent if time_watching and total_video_time is null', function(done) {
		const a = new Analytic({
			correct_on: 3,
		});
		a.validate(function(err) {
			expect(err.errors.time_spent).to.exist;
			done();
		});
	});
	it('should require correct_on if time_watching and total_video_time is null', function(done) {
		const a = new Analytic({
			time_spent: 3,
		});
		a.validate(function(err) {
			expect(err.errors.correct_on).to.exist;
			done();
		});
	});
	it('should require time_watching if time_spent and correct_on is null', function(done) {
		const a = new Analytic({
			total_video_time: 3,
		});
		a.validate(function(err) {
			expect(err.errors.time_spent).to.exist;
			done();
		});
	});
	it('should require total_video_time if time_spent and correct_on is null', function(done) {
		const a = new Analytic({
			time_watching: 3,
		});
		a.validate(function(err) {
			expect(err.errors.total_video_time).to.exist;
			done();
		});
	});
	it('all analytic fields should be valid if theyre given numbers', function(done) {
		const a = new Analytic({
			time_watching: 3,
			total_video_time: 3,
			time_spent: 3,
			correct_on: 3,
		});
		a.validate(function(err) {
			expect(err.errors.time_watching).to.not.exist;
			expect(err.errors.total_video_time).to.not.exist;
			expect(err.errors.time_spent).to.not.exist;
			expect(err.errors.correct_on).to.not.exist;
			done();
		});
	});
	it('all analytic fields should be invalid if theyre not given numbers', function(done) {
		const a = new Analytic({
			time_watching: {},
			total_video_time: {},
			time_spent: {},
			correct_on: {},
		});
		a.validate(function(err) {
			expect(err.errors.time_watching).to.exist;
			expect(err.errors.total_video_time).to.exist;
			expect(err.errors.time_spent).to.exist;
			expect(err.errors.correct_on).to.exist;
			done();
		});
	});
});
