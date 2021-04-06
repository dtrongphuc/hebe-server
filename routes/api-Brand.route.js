const express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
let Router = express.Router();

const brandController = require('../controllers/brand.controller');

let initBrandAPI = (app) => {
	Router.post(
		'/create',
		upload.single('image'),
		brandController.createNewBrand
	);

	Router.get('/get-all', brandController.getAllBrands);
	return app.use('/api/brand', Router);
};

module.exports = initBrandAPI;
