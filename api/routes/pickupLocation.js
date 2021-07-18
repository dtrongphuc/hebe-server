const { Router } = require('express');
const rejection = require('../validations/rejection');
const { getPickupLocations } = require('../../services/pickupLocation');

const route = Router();

module.exports = (app) => {
	app.use('/pickup-locations', route);

	route.get('/', async (req, res, next) => {
		try {
			let { locations } = await getPickupLocations();
			return res.status(200).json({ success: true, locations });
		} catch (error) {
			next(error);
		}
	});
};
