const { Router } = require('express');
const { signUp, signIn, createResetToken } = require('../../services/auth');
const {
	validateRegister,
	validateLogin,
	validateExistEmail,
} = require('../validations/account');
const rejection = require('../validations/rejection');
const isAuth = require('../middlewares/isAuth');
const isUser = require('../middlewares/isUser');
const route = Router();

module.exports = (app) => {
	app.use('/account', route);

	route.post('/signup', validateRegister, rejection, async (req, res, next) => {
		try {
			const { token, firstName, lastName, email } = await SignUp(req.body);

			res.cookie('token', token, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000, // 24 hours
			});

			return res.status(200).json({
				success: true,
				msg: 'Tạo tài khoản thành công',
				firstName,
				lastName,
				email,
			});
		} catch (error) {
			next(error);
		}
	});

	// LOGIN
	route.post('/login', validateLogin, rejection, async (req, res, next) => {
		try {
			const { token, firstName, lastName, email, role } = await SignIn(
				req.body
			);

			res.cookie('token', token, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000, // 24 hours
			});

			return res.status(200).json({
				success: true,
				msg: 'Login successful',
				firstName,
				lastName,
				email,
				role,
			});
		} catch (error) {
			next(error);
		}
	});

	route.get('/auth', isAuth, isUser, (req, res) => {
		return res.status(200).json({
			loggedIn: true,
			firstName: req.user.firstname,
			lastName: req.user.lastname,
			email: req.user.email,
			role: req.user.role,
		});
	});

	route.get('/logout', (req, res) => {
		res.clearCookie('token');

		return res.status(200).json({
			success: true,
		});
	});

	route.post(
		'/password/reset',
		validateExistEmail,
		rejection,
		async (req, res, next) => {
			try {
				const { message } = await createResetToken(req.body);

				return res.status(200).json({
					success: true,
					message,
				});
			} catch (error) {
				next(error);
			}
		}
	);
};
