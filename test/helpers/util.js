const Analytic = require('../../backend/models/analytic');
const Program = require('../../backend/models/program');
const FocusItem = require('../../backend/models/focus_item');

const models = {
	analytic: require('../../backend/models/analytic'),
	program: require('../../backend/models/program'),
	focusitem: require('../../backend/models/focusitem'),
	student: require('../../backend/models/student'),
	teacher: require('../../backend/models/teacher'),
};

module.exports.generateAndStoreModel = async (
	modelName,
	overwrites,
	valid = true
) => {
	if (!models[modelName]) throw new Error('Invalid model');

	const model = models[modelName];
	let data = require(`../fixtures/${modelName}.js`)[
		value ? 'valid' : 'invalid'
	];

	if (overwrites) {
		data = Object.assign({}, modelFixture, overwrites);
	}

	return await new model(data).save();
};
