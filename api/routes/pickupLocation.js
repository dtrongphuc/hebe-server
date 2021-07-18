const { Router } = require('express');
const rejection = require('../validations/rejection');
const {
	getPickupLocations,
	putPickupLocations,
} = require('../../services/pickupLocation');
const { validatePickupLocations } = require('../validations/shipping');

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

	route.put('/', validatePickupLocations, rejection, async (req, res, next) => {
		try {
			await putPickupLocations(req.body);
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});
};
