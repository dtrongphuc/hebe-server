const express = require('express');
const Router = express.Router();

const initAccountAPI = require('./api-Account.route');
const initBrandAPI = require('./api-Brand.route');
const initGroupAPI = require('./api-Group.route');
const initProductAPI = require('./api-Product.route');
const initReviewAPI = require('./api-Review.route');
const initCollectionAPI = require('./api-Collection.route');
const initAddressAPI = require('./api-Address.route');
const { generateSignature } = require('../helpers/cloudinary');

const APIRoutes = (app) => {
	initAccountAPI(app);
	initProductAPI(app);
	initReviewAPI(app);
	initBrandAPI(app);
	initGroupAPI(app);
	initCollectionAPI(app);
	initAddressAPI(app);

	app.use(
		'/api/image',
		Router.post('/upload', async (req, res) => {
			try {
				const { folder } = req.body;
				const { timestamp, signature } = await generateSignature(folder);
				return res.status(200).json({
					success: true,
					timestamp,
					signature,
					folder,
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
					msg: error,
				});
			}
		})
	);
};

module.exports = APIRoutes;
