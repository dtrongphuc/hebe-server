const { Router } = require('express');
const address = require('./routes/address');
const auth = require('./routes/auth');
const brand = require('./routes/brand');
const cart = require('./routes/cart');
const category = require('./routes/category');
const cloudinary = require('./routes/cloudinary');
const product = require('./routes/product');
const review = require('./routes/review');
const collection = require('./routes/collection');
const pickupLocation = require('./routes/pickupLocation');
const shippingMethod = require('./routes/shippingMethod');
const order = require('./routes/order');
const account = require('./routes/account');

module.exports = () => {
	const app = Router();

	auth(app);
	product(app);
	review(app);
	cart(app);
	address(app);
	brand(app);
	category(app);
	collection(app);
	cloudinary(app);
	pickupLocation(app);
	shippingMethod(app);
	order(app);
	account(app);

	return app;
};
