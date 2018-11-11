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

module.exports.getAnalyticByProgram = (req, res) => {
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