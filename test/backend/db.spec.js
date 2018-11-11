const chai = require('chai');
const mongoose = require('mongoose');
const Program = require('../../backend/models/program');
const Analytic = require('../../backend/models/analytic');
const Focus_Item = require('../../backend/models/focus_item');
const Student = require('../../backend/models/student');
const Teacher = require('../../backend/models/teacher');

const name = 'Test Program';
const desc = 'A temporary program used to run tests on the database.';
const valid_program_json = {
	name: name,
	description: desc,
	type: 'mobile game',
};
const invalid_program_json = {
	name: name,
	description: desc,
};

describe('backend/db', function() {
	it('Create invalid program. Should generate an error.', function() {
		const did_fail = false;
		const test_program = new Program(invalid_program_json);

		test_program.save(function(err, doc) {
			chai.expect(err).is.not.null;
		});
	});
	it('Create a valid program in mongoose', function() {
		// First deletes all the valid programs in order to clean out the databse
		Program.deleteMany(valid_program_json).exec();

		const test_program = new Program(valid_program_json);
		test_program.save(function(error) {
			if (error) {
				chai.assert.fail();
			}
		});
	});
	it('Query the database for the created program', function() {
		Program.find(valid_program_json, function(err, docs) {
			chai.expect(err).to.be.null;
			chai.expect(docs).to.have.lengthOf(1);
			chai.expect(docs[0].name).to.equal(name);
			chai.expect(docs[0].description).to.equal(desc);
		});
		// console.log(retreived_program)
	});
	it('Delete the queried program', function() {
		Program.deleteMany(valid_program_json).exec();
		Program.find(valid_program_json, function(err, docs) {
			chai.expect(err).to.be.null;
			chai.expect(docs).to.have.lengthOf(0);
		});
	});
});
