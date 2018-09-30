const generateAPIHeadersWithToken = token => {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};
};

const generateAPIHeaders = getState => {
	if (!getState) return console.error('getState is required');

	return generateAPIHeadersWithToken(getState().teacher.token);
};

module.exports.generateAPIHeadersWithToken = generateAPIHeadersWithToken;
module.exports.generateAPIHeaders = generateAPIHeaders;
