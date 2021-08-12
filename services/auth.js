const bcrypt = require('bcrypt');
const jwtHelper = require('../helpers/jwt');
const Account = require('../models/account.model');
const config = require('../config');
const hbs = require('nodemailer-express-handlebars');
const transporter = require('../helpers/mailer');

module.exports = {
	signUp: async (userInput) => {
		try {
			let salt = config.password.salt;

			const { password } = userInput;

			const hashedPw = await bcrypt.hash(password, salt);

			const { firstname, lastname, email } = userInput;

			let account = await Account.create({
				firstname: firstname.trim(),
				lastname: lastname.trim(),
				email: email.trim(),
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
	signIn: async (userInput) => {
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

	createResetToken: async ({ email }) => {
		try {
			const account = await Account.findOne({ email });
			const { randomBytes } = await import('crypto');

			const token = randomBytes(48).toString('hex');
			account.verifyCode = token;

			let options = {
				viewEngine: {
					extname: '.handlebars',
					defaultLayout: '',
					layoutsDir: '',
				},
				viewPath: 'templates/',
			};
			transporter.use('compile', hbs(options));

			let mail = {
				from: config.email.user,
				to: email,
				subject: 'Customer account password reset',
				template: 'reset-password',
				context: {
					token: token,
					url_store: config.client.url,
					url_reset: `${config.client.url}/account/reset/${token}`,
				},
				attachments: [
					{
						filename: 'HEBE_Logo.png',
						path: './resources/images/HEBE_Logo.png',
						cid: 'unique@cid',
					},
				],
			};
			let info = await transporter.sendMail(mail);
			console.log('Message sent: %s', info.messageId);
			await account.save();
			return {
				message: `We've sent you an email with a link to update your password.`,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	updatePasswordWithToken: async ({ token, password }) => {
		try {
			let salt = config.password.salt;

			const account = await Account.findOne({ verifyCode: token });
			const hashedPw = await bcrypt.hash(password, salt);
			account.verifyCode = '';
			account.password = hashedPw;

			await account.save();

			return {
				message: 'Password reset successful',
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getEmailByToken: async ({ token }) => {
		try {
			const account = await Account.findOne({ verifyCode: token }).select(
				'email'
			);
			if (!account) {
				return Promise.reject({
					message: 'Token invalid',
				});
			}

			return { email: account.email };
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
