const chai = require('chai');
const mongoose = require('mongoose');
const Analytic = require('../../../backend/models/analytic');

const util = require('../helpers/util');

const student_id = '123456789012';
const focus_item_id = '123456789012';
const program_id = '123456789012';
const correct_on = 3;

const valid_app_analytic = {
	student: '123456789012',
	focus_item: '123456789012',
	program: '123456789012',
	correct_on: 3,
	time_spent: 10000,
};

const invalid_app_analytic = {
	student: student_id,
	focus_item: focus_item_id,
	program: program_id,
	correct_on: correct_on,
	time_watching: 10000,
};

describe('backend/models/analytic', function() {
	beforeEach(async function() {
		// Start with a clean slate each test
		await Analytic.deleteMany(valid_app_analytic).exec();
	});

	after(async function() {
		// Clean up
		await Analytic.deleteMany(valid_app_analytic).exec();
	});

	it('Create invalid analytic. Should generate an error.', async function() {
		const test_analytic = new Analytic(invalid_app_analytic);

		test_analytic.save(function(err, doc) {
			chai.expect(err).is.not.null;
		});
	});
	it('Create a valid analytic in mongoose', async function() {
		const test_analytic = new Analytic(valid_app_analytic);
		const saved = await test_analytic.save();

		if (!saved) {
			chai.assert.fail();
		}

		chai.expect(saved).to.be.an('object');
	});
	it('Query the database for the created analytic', async function() {
		const generated = await util.generateAndStoreModel('analytic');

		console.log(await new Analytic(valid_app_analytic).save());

		const analytics = await Analytic.find(valid_app_analytic);

		chai.expect(analytics).to.have.lengthOf(1);
		chai.expect(docs[0].correct_on).to.equal(correct_on);
	});
});
