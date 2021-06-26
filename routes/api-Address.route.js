const express = require('express');
const { validateAddress } = require('../validate/account/address.validate');
const authJwt = require('../middleware/passport/authenticator');
const rejectMiddleware = require('../middleware/rejectErrors.middleware');
const {
	createNewAddress,
	getAllAddresses,
	getAddressById,
	putEditAddress,
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

	//GET ADDRESS BY ID
	Router.get('/get', authJwt, getAddressById);

	//POST NEW ADDRESS
	Router.put(
		'/edit',
		authJwt,
		validateAddress,
		rejectMiddleware,
		putEditAddress
	);

	return app.use('/api/account/address', Router);
};

module.exports = initAddressAPI;
