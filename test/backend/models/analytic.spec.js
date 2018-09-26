const chai = require('chai');
const mongoose = require('mongoose');
const Analytic = require('../../backend/models/analytic');

const student_id = 00001;
const focus_item_id = 00001;
const program_id = 00001;
const correct_on = 3;


const valid_app_analytic = {
	student: student_id,
	focus_item: focus_item_id,
	program: program_id,
	type: 'mobile game'
};
const invalid_app_analytic = {
	name: name,
	description: desc,
}

describe('Simple database test', () => {
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
			chai.expect(docs[0].name).to.equal(name)
			chai.expect(docs[0].description).to.equal(desc)
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