const initAccountAPI = require('./api-Account.route');
const initBrandAPI = require('./api-Brand.route');
const initGroupAPI = require('./api-Group.route');
const initProductAPI = require('./api-Product.route');
const initReviewAPI = require('./api-Review.route');
const initCollectionAPI = require('./api-Collection.route');
const initAddressAPI = require('./api-Address.route');

const APIRoutes = (app) => {
	initAccountAPI(app);
	initProductAPI(app);
	initReviewAPI(app);
	initBrandAPI(app);
	initGroupAPI(app);
	initCollectionAPI(app);
	initAddressAPI(app);
};

module.exports = APIRoutes;
