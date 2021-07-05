const express = require('express');
let Router = express.Router();

const authJwt = require('../middleware/passport/authenticator');
const rejectErrorsMiddleware = require('../middleware/rejectErrors.middleware');
const { validateAddToCart } = require('../validate/cart/cart.validate');
const { addToCart, fetchCart } = require('../controllers/cart.controller');

let initCartAPI = (app) => {
	Router.post(
		'/add',
		authJwt,
		validateAddToCart,
		rejectErrorsMiddleware,
		addToCart
	);
	Router.get('/', authJwt, fetchCart);

	return app.use('/api/cart', Router);
};

module.exports = initCartAPI;
