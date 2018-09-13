const Program = require('mongoose').model('Program');
var bcrypt = require('bcryptjs');

module.exports.getAll = (req, res) => {
	Program.find({})
		.then(programs => {
			return res.status(200).json({
				status: 'success',
				programs: programs ? programs : [], // Ensure we always at the bare minimum send back an empty array
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

module.exports.getOne = (req, res) => {
	Program.findById(req.params.id)
		.then(program => {
			return res.status(200).json({
				status: 'success',
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
	})
		.save()
		.then(program => {
			return res.status(200).json({
				status: 'success',
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

			program
				.save()
				.then(updatedProgram => {
					return res.status(200).json({
						status: 'success',
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
				status: 'success',
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
