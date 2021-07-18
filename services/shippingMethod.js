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
};
