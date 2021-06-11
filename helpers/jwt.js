const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES = process.env.EXPIRES;

module.exports = {
	createToken: (payload) => {
		return jwt.sign(payload, SECRET_KEY, {
			expiresIn: EXPIRES,
		});
	},

	verifyToken: (token) => {
		return jwt.verify(token, SECRET_KEY);
	},
};
