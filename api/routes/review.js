const { Router } = require('express');
const rejection = require('../validations/rejection');
const { getReviews } = require('../../services/review');

const route = Router();

module.exports = (app) => {
	app.use('/reviews', route);

	route.get('/', async (req, res, next) => {
		try {
			let { reviews } = await getReviews();
			return res.status(200).json({ success: true, reviews });
		} catch (error) {
			next(error);
		}
	});
};
