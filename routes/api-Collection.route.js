const express = require('express');
const collectionController = require('../controllers/collection.controller');
var Router = express.Router();

let initCollectionAPI = (app) => {
	Router.get('/:path', collectionController.getCollections);

	return app.use('/api/collections', Router);
};

module.exports = initCollectionAPI;
