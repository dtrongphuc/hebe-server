const Order = require('../models/order.model');

module.exports = {
	createOrder: async (orderInput, user) => {
		try {
			await Order.create({
				account: user._id,
				products: [
					{
						product: '60e2bf4c4d601803dc2743cb',
						variant: '60e2bf4c4d601803dc2743cb',
						sku: '60e2bf4c4d601803dc2743d0',
						quantity: 2,
					},
				],
				shippingInfo: 'kahsdkahsdao',
				shippingMethod: '60f40ebb42c78d4ea0d20c48',
				paymentMethod: 'credit-card',
				voucherPrice: 0,
			});
		} catch (error) {
			console.log(error);
		}
	},
};
