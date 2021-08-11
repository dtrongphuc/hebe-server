const bcrypt = require('bcrypt');
const jwtHelper = require('../helpers/jwt');
const Account = require('../models/account.model');
const config = require('../config');

module.exports = {
	SignUp: async (userInput) => {
		try {
			let salt = config.password.salt;

			const { password } = userInput;

			const hashedPw = await bcrypt.hash(password, salt);

			const { firstname, lastname, email } = userInput;

			let account = await Account.create({
				firstname,
				lastname,
				email,
				password: hashedPw,
			});
			let token = jwtHelper.createToken({
				id: account._id,
				role: account.role,
			});

			return {
				token,
				firstName: account.firstname,
				lastName: account.lastname,
				email: account.email,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},
	SignIn: async (userInput) => {
		try {
			const account = await Account.findOne({ email: userInput?.email });

			let token = jwtHelper.createToken({
				id: account._id,
				role: account.role,
			});

			return {
				token,
				firstName: account.firstname,
				lastName: account.lastname,
				email: account.email,
				role: account.role,
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},
};
