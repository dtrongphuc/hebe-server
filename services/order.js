const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

module.exports = {
	createOrder: async (orderInput, user) => {
		try {
			const {
				billInfo,
				deliveryMethod,
				shippingMethod,
				pickupLocation,
				paymentMethod,
			} = orderInput;

			// find products cart of user
			const { products } = await Cart.findOne({ account: user._id }).select(
				'-products.createdAt'
			);

			await Order.create({
				account: user._id,
				products: [...products],
				billInfo: {
					...billInfo,
				},
				deliveryMethod,
				shippingMethod,
				pickupLocation,
				paymentMethod,
				voucherPrice: 0,
			});

			// clear user cart
			await Cart.findOneAndDelete({ account: user._id });
		} catch (error) {
			console.log(error);
		}
	},
};
