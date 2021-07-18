const { Router } = require('express');
const rejection = require('../validations/rejection');
const { getReviews } = require('../../services/review');
const { requestDestroySignature } = require('../../services/cloudianry');

const route = Router();

module.exports = (app) => {
	app.use('/cloudinary', route);

	route.post('/image/upload/signature', async (req, res, next) => {
		try {
			const { timestamp, signature, folder } = await requestSignature(req.body);
			return res.status(200).json({
				success: true,
				timestamp,
				signature,
				folder,
			});
		} catch (error) {
			next(error);
		}
	});

	route.post('/image/destroy/signature', async (req, res, next) => {
		try {
			const { timestamp, signature } = await requestDestroySignature(req.body);
			return res.status(200).json({
				success: true,
				timestamp,
				signature,
			});
		} catch (error) {
			next(error);
		}
	});
};
