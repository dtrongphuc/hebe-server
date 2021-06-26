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

	// GET INFO
	Router.get('/info', authJwt, (req, res) => {
		res.json({
			content: 'this is private route',
		});
	});

	return app.use('/api/account', Router);
};

module.exports = initAccountAPI;
