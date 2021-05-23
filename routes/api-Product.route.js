const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
let Router = express.Router();

const productController = require('../controllers/product.controller');
const prMiddleware = require('../middleware/products/product.middleware.js');

let initProductAPI = (app) => {
	Router.get('/front-page', productController.getFrontPageProducts);
	Router.get('/getAll', productController.getAll);
	Router.get('/path/:path', productController.getProductByPath);
	Router.get('/id/:productId', productController.getProductById);
	Router.get('/edit/id/:productId', productController.getEditProduct);
	Router.post(
		'/create',
		upload.array('images'),
		[prMiddleware.validation, prMiddleware.parseData],
		productController.postProduct
	);
	return app.use('/api/product', Router);
};

module.exports = initProductAPI;
