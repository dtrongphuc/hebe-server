const ShippingMethod = require('../models/shippingMethod.model');

module.exports = {
	getShippingMethods: async () => {
		try {
			const methods = await ShippingMethod.find({});

			return {
				success: true,
				shippingMethods: methods,
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	putShippingMethods: async ({ shipping_methods }) => {
		try {
			let shippingMethods = shipping_methods?.map((method) => {
				const { shipping_name, shipping_price } = method;
				let displayPrice = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(shipping_price);

				return {
					name: shipping_name,
					price: shipping_price,
					displayPrice: shipping_price === 0 ? 'Free' : `${displayPrice}`,
				};
			});

			await ShippingMethod.deleteMany({});
			await Promise.all(
				shippingMethods.map((method) =>
					ShippingMethod.create({
						...method,
					})
				)
			);
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},
};
