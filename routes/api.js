const express = require('express');
const Router = express.Router();

const initAccountAPI = require('./api-Account.route');
const initBrandAPI = require('./api-Brand.route');
const initGroupAPI = require('./api-Group.route');
const initProductAPI = require('./api-Product.route');
const initReviewAPI = require('./api-Review.route');
const initCollectionAPI = require('./api-Collection.route');
const initAddressAPI = require('./api-Address.route');
const initCloudinaryAPI = require('./api-Cloudinary.route');
const initCartAPI = require('./api-Cart.route');
const initConfigAPI = require('./api-Config.route');

const APIRoutes = (app) => {
	initAccountAPI(app);
	initProductAPI(app);
	initReviewAPI(app);
	initBrandAPI(app);
	initGroupAPI(app);
	initCollectionAPI(app);
	initAddressAPI(app);
	initCloudinaryAPI(app);
	initCartAPI(app);
	initConfigAPI(app);
};

module.exports = APIRoutes;
