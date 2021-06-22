const express = require('express');
const accountController = require('../controllers/account.controller');
const accountMiddleware = require('../middleware/account/account.middleware');
const { validateAddress } = require('../middleware/account/address.middleware');
const authJwt = require('../middleware/passport/authenticator');
var Router = express.Router();

let initAccountAPI = (app) => {
	// POST NEW ACCOUNT
	Router.post(
		'/create',
		accountMiddleware.createAccountValidate,
		accountMiddleware.hashPassword,
		accountController.createAccount
	);

	// LOGIN
	Router.post(
		'/login',
		accountMiddleware.loginValidate,
		accountMiddleware.comparePassword,
		accountController.login
	);

	// GET INFO
	Router.get('/info', authJwt, (req, res) => {
		res.json({
			content: 'this is private route',
		});
	});

	//POST NEW ADDRESS
	Router.post('/address', validateAddress, accountController.createNewAddress);

	return app.use('/api/account', Router);
};

module.exports = initAccountAPI;
