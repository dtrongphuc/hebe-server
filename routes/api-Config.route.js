const express = require('express');
const {
	putShippingConfig,
	getShippingConfig,
	getPickupLocations,
} = require('../controllers/config.controller');
let Router = express.Router();

const authJwt = require('../middleware/passport/authenticator');
const rejectErrorsMiddleware = require('../middleware/rejectErrors.middleware');
const { validateShipping } = require('../validate/config/shipping');

let initConfigAPI = (app) => {
	Router.put(
		'/shipping',
		validateShipping,
		rejectErrorsMiddleware,
		putShippingConfig
	);

	Router.get('/shipping', getShippingConfig);
	Router.get('/pickup-locations', getPickupLocations);

	return app.use('/api/config', Router);
};

module.exports = initConfigAPI;
