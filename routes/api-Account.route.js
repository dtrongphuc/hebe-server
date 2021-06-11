const express = require('express');
const accountController = require('../controllers/account.controller');
const accountMiddleware = require('../middleware/account/account.middleware');
var Router = express.Router();

let initAccountAPI = (app) => {
	// POST NEW ACCOUNT
	Router.post(
		'/create',
		accountMiddleware.createAccountValidate,
		accountMiddleware.hashPassword,
		accountController.createAccount
	);

	return app.use('/api/account', Router);
};

module.exports = initAccountAPI;
