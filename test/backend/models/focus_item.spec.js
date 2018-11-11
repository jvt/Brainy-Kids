const expect = require('chai').expect;
const mongoose = require('mongoose');
const FocusItem = require('../../../backend/models/focus_item');

describe('backend/models/focus_item', function() {
	it('should be invalid if name is empty', function(done) {
		const fi = new FocusItem();
		fi.validate(function(err) {
			expect(err.errors.name).to.exist;
			done();
		});
	});
	it('should be invalid if name is not a string', function(done) {
		const fi = new FocusItem({
			name: [],
		});
		fi.validate(function(err) {
			expect(err.errors.name).to.exist;
			done();
		});
	});
	it('should be invalid if program is empty', function(done) {
		const fi = new FocusItem();
		fi.validate(function(err) {
			expect(err.errors.program).to.exist;
			done();
		});
	});
	it('should be invalid if program is not an ObjectID', function(done) {
		const fi = new FocusItem({
			program: 'testing',
		});
		fi.validate(function(err) {
			expect(err.errors.program).to.exist;
			done();
		});
	});
	it('should be valid if program is an ObjectID', function(done) {
		const fi = new FocusItem({
			program: mongoose.Types.ObjectId(),
		});
		fi.validate(function(err) {
			expect(err.errors.program).to.not.exist;
			done();
		});
	});
	it('should be valid if unit is empty', function(done) {
		const fi = new FocusItem();
		fi.validate(function(err) {
			expect(err.errors.unit).to.not.exist;
			done();
		});
	});
	it('should be valid if unit is not empty', function(done) {
		const fi = new FocusItem({
			unit: 'testing',
		});
		fi.validate(function(err) {
			expect(err.errors.unit).to.not.exist;
			done();
		});
	});
	it('should be valid if subunit is empty', function(done) {
		const fi = new FocusItem();
		fi.validate(function(err) {
			expect(err.errors.subunit).to.not.exist;
			done();
		});
	});
	it('should be valid if subunit is not empty', function(done) {
		const fi = new FocusItem({
			subunit: 'testing',
		});
		fi.validate(function(err) {
			expect(err.errors.subunit).to.not.exist;
			done();
		});
	});
});
