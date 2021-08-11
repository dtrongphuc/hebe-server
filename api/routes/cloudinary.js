const { Router } = require('express');
const {
	requestDestroySignature,
	requestSignature,
} = require('../../services/cloudianry');
const { cloud } = require('../../config');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const route = Router();

module.exports = (app) => {
	app.use('/cloudinary', isAuth, isAdmin, route);

	route.post('/image/upload/signature', async (req, res, next) => {
		try {
			const { timestamp, signature, folder } = await requestSignature(req.body);

			return res.status(200).json({
				success: true,
				url: `https://api.cloudinary.com/v1_1/${cloud.name}/image/upload?api_key=${cloud.api_key}&folder=${folder}&timestamp=${timestamp}&signature=${signature}`,
			});
		} catch (error) {
			next(error);
		}
	});

	route.post('/image/destroy/signature', async (req, res, next) => {
		try {
			const { timestamp, signature, public_id } = await requestDestroySignature(
				req.body
			);
			return res.status(200).json({
				success: true,
				url: `https://api.cloudinary.com/v1_1/${cloud.name}/image/destroy?api_key=${cloud.api_key}&public_id=${public_id}&timestamp=${timestamp}&signature=${signature}`,
			});
		} catch (error) {
			next(error);
		}
	});
};
