const express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
let Router = express.Router();
const cloudinary = require('../models/cloudinary.model');
const brandController = require('../controllers/brand.controller');

let initBrandAPI = (app) => {
	Router.post(
		'/create',
		upload.single('image'),
		brandController.createNewBrand
	);
	Router.post('/upload', upload.single('image'), async (req, res) => {
		console.log('upload');
		let result = await cloudinary.uploadBrandImage(req.file.path);
		return res.status(200);
	});
	Router.get('/get-all', brandController.getAllBrands);
	Router.get('/:path', brandController.getBrandCollections);
	return app.use('/api/brand', Router);
};

module.exports = initBrandAPI;
