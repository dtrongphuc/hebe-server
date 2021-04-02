const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'assets/uploads/' });
let Router = express.Router();

const productController = require('../controllers/product.controller');

let initProductAPI = (app) => {
	Router.get('/featured-products', productController.getFeaturedProduct);
	Router.get('/products/:productId', productController.getSingleProduct);
	Router.post(
		'/post-product',
		upload.array('images'),
		productController.postProduct
	);
	return app.use('/api', Router);
};

module.exports = initProductAPI;
