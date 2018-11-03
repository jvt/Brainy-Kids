const Program = require('mongoose').model('Program');
const FocusItem = require('mongoose').model('Focus_Item');
const Analytic = require('mongoose').model('Analytic');
const Mongoose = require('mongoose');

module.exports.getAll = (req, res) => {
	Program.find({})
		.then(async programs => {
			// Short circuit the code below
			if (!programs) {
				return res.status(200).json({
					status: 'ok',
					programs: [],
				});
			}

			// Adds a ?focus_items=true query parameter to automatically return all associated focus_items too in a single API call
			if (req.query.focus_items === 'true') {
				const populatedPrograms = await Promise.all(
					programs.map(async p => {
						const focus_items = await FocusItem.find({
							program: p._id,
						});

						const pJSON = p.toJSON(); // We have to cast to a JSON object first before modifying
						pJSON.focus_items = focus_items;
						return pJSON;
					})
				);

				return res.status(200).json({
					status: 'ok',
					programs: populatedPrograms ? populatedPrograms : [],
				});
			} else {
				return res.status(200).json({
					status: 'ok',
					programs: programs ? programs : [], // Ensure we always at the bare minimum send back an empty array
				});
			}
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		});
};

module.exports.getOne = (req, res) => {
	Program.findById(req.params.id)
		.then(program => {
			return res.status(200).json({
				status: 'ok',
				program: program,
			});
		})
		.catch(err => {
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		});
};

module.exports.create = (req, res) => {
	new Program({
		name: req.body.name,
		description: req.body.description,
		type: req.body.type,
	})
		.save()
		.then(program => {
			return res.status(200).json({
				status: 'ok',
				program: program,
			});
		})
		.catch(err => {
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		});
};

module.exports.update = (req, res) => {
	Program.findById(req.params.id)
		.then(program => {
			if (!program) {
				return res.status(404).json({
					status: 'error',
					message: 'Program not found',
				});
			}

			// Update the name if the body request contains a name
			program.name = req.body.name ? req.body.name : program.name;

			// Update the description if the body request contains a description
			program.description = req.body.description
				? req.body.description
				: program.description;

			// Update the type if the body request contains a type
			program.type = req.body.type ? req.body.type : program.type;

			program
				.save()
				.then(updatedProgram => {
					return res.status(200).json({
						status: 'ok',
						program: updatedProgram,
					});
				})
				.catch(err => {
					return res.status(500).json({
						status: 'error',
						error: err,
						message:
							'An unexpected internal server error has occurred!',
					});
				});
		})
		.catch(err => {
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		});
};

module.exports.deleteOne = (req, res) => {
	Program.findByIdAndRemove(req.params.id)
		.then(program => {
			return res.status(200).json({
				status: 'ok',
			});
		})
		.catch(err => {
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		});
};

module.exports.analytics = (req, res) => {
	// If the request was made with a student's token
	if (req.user.student_id) {
		return res.status(401).json();
	}

	var program_id;
	try {
		program_id = Mongoose.Types.ObjectId(req.params.id);
	}
	catch (err) {
		return res.status(500).json({
			status: 'error',
			error: err,
			message: 'An unexpected internal server error has occurred!',
		});
	}

	Program.countDocuments({ _id: req.params.id }, function (err, count) {
		if (err) {
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		}
		// Short circuits to returning error if the provided program isn't in the DB
		if (count == 0) {
			return res.status(404).json({
				status: 'error',
				message: 'Unable to find program ' + req.params.id,
			});
		}

		if (req.body.focus_items) {
			Analytic.find()
				.populate('program')
				.where('program._id').equals(program_id)
				.populate('student')
				.where('student.teacher').equals(req.user._id)
				.where('focus_item').in(req.body.focus_items)
				.populate('focus_item')
				.then(function (analytics) {
					return res.status(200).json({
						status: 'ok',
						focus_items: sortAnalyticsIntoFocusItemStructure(analytics)
					});
				})
				.catch(err => {
					return res.status(500).json({
						status: 'error',
						error: err,
						message: 'An unexpected internal server error has occurred!',
					});
				});
		} else if (req.body.focus_item) {
			Analytic.find()
				.populate('program')
				.where('program._id').equals(program_id)
				.populate('student')
				.where('student.teacher').equals(req.user._id)
				.where('focus_item').equals(req.body.focus_item)
				.populate('focus_item')
				.then(function (analytics) {
					return res.status(200).json({
						status: 'ok',
						focus_items: sortAnalyticsIntoFocusItemStructure(analytics)
					});
				})
				.catch(err => {
					return res.status(500).json({
						status: 'error',
						error: err,
						message: 'An unexpected internal server error has occurred!',
					});
				});
		} else {
			Analytic.find()
				.populate('program')
				.where('program._id').equals(program_id)
				.populate('student')
				.where('student.teacher').equals(req.user._id)
				.populate('focus_item')
				.then(function (analytics) {
					return res.status(200).json({
						status: 'ok',
						focus_items: sortAnalyticsIntoFocusItemStructure(analytics)
					});
				})
				.catch(err => {
					return res.status(500).json({
						status: 'error',
						error: err,
						message: 'An unexpected internal server error has occurred!',
					});
				});
		}
	});
};

module.exports.getFocusItemByProgram = (req, res) => {
	Program.countDocuments({_id: req.params.id}, function (err, count) {
		if (err) {
			return res.status(500).json({
				status: 'error',
				error: err,
				message: 'An unexpected internal server error has occurred!',
			});
		}
		if (count == 0) {
			return res.status(404).json({
				status: 'error',
				message: 'Unable to find program ' + req.params.id,
			});
		}
 		FocusItem.find({program: req.params.id})
		.then(focus_items => {
			return res.status(200).json({
				status: 'ok',
				focus_items: focus_items ? focus_items : [], // Ensure we always at the bare minimum send back an empty array
			});
		})
		.catch(err => {
			return res.status(404).json({
				status: 'error',
				error: err,
				message: 'Unable to find program ' + req.params.id,
			});
		});
	});
 }

function sortAnalyticsIntoFocusItemStructure(analytics) {
	const focus_items_set = new Set();
	for (i in analytics) {
		analytic = analytics[i];
		focus_items_set.add(analytic.focus_item);
	}

	const focus_items_list = Array.from(focus_items_set);
	for (i in focus_items_set.values()) {
		var focus_item = focus_items_list[i];
		focus_item.analytics = [];
		for (j in analytics) {
			var analytic = analytics[j];
			if (analytic.focus_item._id == focus_item._id) {
				analytic.focus_item = analytic.focus_item._id;
				focus_item.analytics.put(analytic);
			}
		} 
	}
	return focus_items_list;
}
