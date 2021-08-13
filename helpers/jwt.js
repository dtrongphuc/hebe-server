const jwt = require('jsonwebtoken');
const config = require('../config');

const { secretKey, expires } = config.auth;

module.exports = {
	createToken: (payload) => {
		return jwt.sign(payload, secretKey, {
			expiresIn: expires,
		});
	},

	verifyToken: (token) => {
		return jwt.verify(token, secretKey);
	},
};
