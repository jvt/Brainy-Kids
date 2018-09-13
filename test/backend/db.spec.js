const chai = require('chai');
const Program = require('../../backend/models/program');
const Analytic = require('../../backend/models/analytic');
const Focus_Item = require('../../backend/models/focus_item');
const Student = require('../../backend/models/student');
const Teacher = require('../../backend/models/teacher');

const name = 'Test Program';
const desc = 'A temporary program used to run tests on the database.';
const program_json = {
	name: name,
	description: desc,
    type: 'mobile game'
};

describe('Simple database test', () => {
	it('Create a program in mongoose', function() {
		const test_program = new Program(program_json);
		test_program.save();
	});
	it('Query the database for the created program', function() {
		Program.find(program_json, function(err, docs) {

			chai.expect(err).to.be.null;
			chai.expect(docs).to.have.lengthOf(1);
			chai.expect(docs[0].name).to.equal(name)
			chai.expect(docs[0].description).to.equal(desc)
		});
		// console.log(retreived_program)
	});
	it('Delete the queried program', function() {
		Program.deleteMany(program_json).exec();
		Program.find(program_json, function(err, docs) {
			chai.expect(err).to.be.null;
			chai.expect(docs).to.have.lengthOf(0);
		});
	});
});

