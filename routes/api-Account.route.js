const express = require('express');
const accountController = require('../controllers/account.controller');
const accountMiddleware = require('../middleware/account/account.middleware');
const {
	validateLogin,
	validateRegister,
} = require('../validate/account/account.validate');
const { validateAddress } = require('../validate/account/address.validate');
const authJwt = require('../middleware/passport/authenticator');
const rejectMiddleware = require('../middleware/rejectErrors.middleware');
var Router = express.Router();

let initAccountAPI = (app) => {
	// POST NEW ACCOUNT
	Router.post(
		'/create',
		validateRegister,
		rejectMiddleware,
		accountMiddleware.hashPassword,
		accountController.createAccount
	);

	// LOGIN
	Router.post(
		'/login',
		validateLogin,
		rejectMiddleware,
		accountController.login
	);

	Router.get('/auth', authJwt, (req, res) => {
		return res.status(200).json({
			loggedIn: true,
			firstName: req.user.firstname,
			lastName: req.user.lastname,
			email: req.user.email,
		});
	});

	return app.use('/api/account', Router);
};

module.exports = initAccountAPI;
