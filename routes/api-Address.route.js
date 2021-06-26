const express = require('express');
const { validateAddress } = require('../validate/account/address.validate');
const authJwt = require('../middleware/passport/authenticator');
const rejectMiddleware = require('../middleware/rejectErrors.middleware');
const {
	createNewAddress,
	getAllAddresses,
} = require('../controllers/address.controller');
var Router = express.Router();

let initAddressAPI = (app) => {
	//POST NEW ADDRESS
	Router.post(
		'/',
		authJwt,
		validateAddress,
		rejectMiddleware,
		createNewAddress
	);
	//GET ALL ADDRESSES BY ACCOUNT
	Router.get('/', authJwt, getAllAddresses);

	return app.use('/api/account/address', Router);
};

module.exports = initAddressAPI;
