const express = require('express');
let Router = express.Router();

const productController = require('../controllers/product.controller');
const rejectErrorsMiddleware = require('../middleware/rejectErrors.middleware');
const { validateProduct } = require('../validate/product/product.validate');

let initProductAPI = (app) => {
	Router.get('/front-page', productController.getFrontPageProducts);
	Router.get('/getAll', productController.getAll);
	Router.get('/path/:path', productController.getProductByPath);
	Router.get('/id/:productId', productController.getProductById);
	Router.get('/edit/id/:productId', productController.getEditProduct);
	Router.post(
		'/create',
		validateProduct,
		rejectErrorsMiddleware,
		productController.postProduct
	);
	return app.use('/api/product', Router);
};

module.exports = initProductAPI;
