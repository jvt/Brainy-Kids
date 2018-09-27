const chai = require('chai');
const mongoose = require('mongoose');
const Analytic = require('../../../backend/models/analytic');

const student_id = 00001;
const focus_item_id = 00001;
const program_id = 00001;
const correct_on = 3;


const valid_app_analytic = {
	student: student_id,
	focus_item: focus_item_id,
	program: program_id,
	correct_on: correct_on,
    time_spent: 10000
};
const invalid_app_analytic = {
	student: student_id,
	focus_item: focus_item_id,
	program: program_id,
	correct_on: correct_on,
    time_watching: 10000
}

describe('Simple analytic test', () => {
	it('Create invalid analytic. Should generate an error.', function() {
		const test_analytic = new Analytic(invalid_app_analytic);


		test_analytic.save(function(err, doc) {
			chai.expect(err).is.not.null;
		});

	});
	it('Create a valid analytic in mongoose', function() {
		// First deletes all the valid analytics in order to clean out the databse
		Analytic.deleteMany(valid_app_analytic).exec();

		const test_analytic = new Analytic(valid_app_analytic);
		test_analytic.save(function(error) {
			if (error) {
				chai.assert.fail();
			}
		});
	});
	it('Query the database for the created analytic', function() {
		Analytic.find(valid_app_analytic, function(err, docs) {

			chai.expect(err).to.be.null;
			chai.expect(docs).to.have.lengthOf(1);
			chai.expect(docs[0].correct_on).to.equal(correct_on);
		});
		// console.log(retreived_program)
	});
});