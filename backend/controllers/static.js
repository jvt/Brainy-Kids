module.exports.status = (req, res) => {
	return res.status(200).json({
		status: 'ok',
	});
};
