const expect = require('chai').expect;
const Program = require('../../../backend/models/program');

describe('backend/models/program', function() {
	it('should be invalid if name is empty', function(done) {
		const p = new Program();
		p.validate(function(err) {
			expect(err.errors.name).to.exist;
			done();
		});
	});
	it('should be invalid if name is not a string', function(done) {
		const p = new Program({
			name: {},
		});
		p.validate(function(err) {
			expect(err.errors.name).to.exist;
			done();
		});
	});
	it('should be invalid if type is empty', function(done) {
		const p = new Program();
		p.validate(function(err) {
			expect(err.errors.type).to.exist;
			done();
		});
	});
	it('should be invalid if type is not `mobile game` or `website`', function(done) {
		const p = new Program({
			type: `Ramblin' Wreck`,
		});
		p.validate(function(err) {
			expect(err.errors.type).to.exist;
			done();
		});
	});
	it('should be valid if description is empty', function(done) {
		const p = new Program();
		p.validate(function(err) {
			expect(err.errors.description).to.not.exist;
			done();
		});
	});
	it('should be valid if description is not empty', function(done) {
		const p = new Program({
			description: 'test',
		});
		p.validate(function(err) {
			expect(err.errors.description).to.not.exist;
			done();
		});
	});
	it('should be invalid if description is not a string', function(done) {
		const p = new Program({
			description: {},
		});
		p.validate(function(err) {
			expect(err.errors.description).to.exist;
			done();
		});
	});
});
