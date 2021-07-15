const Config = require('../models/config.model');

module.exports = {
	putShippingConfig: async (req, res) => {
		try {
			const { pickup_locations, shipping_methods } = req.body;
			let locations = pickup_locations?.map((location) => {
				const {
					pickup_name,
					pickup_price,
					pickup_address,
					pickup_instruction,
				} = location;
				let displayPrice = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD',
				}).format(pickup_price);

				return {
					name: pickup_name,
					displayPrice: pickup_price === 0 ? 'Free' : `${displayPrice}`,
					price: pickup_price,
					instruction: pickup_instruction,
					address: pickup_address,
				};
			});

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

			const config = await Config.findOne({});
			if (!config) {
				await Config.create({
					locations,
					shippingMethods,
				});
			} else {
				config.locations = locations;
				config.shippingMethods = shippingMethods;

				await config.save();
			}

			return res.status(200).json({
				success: true,
				msg: 'successful',
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},

	getShippingConfig: async (req, res) => {
		try {
			const config = await Config.findOne({}).select(
				'locations shippingMethods'
			);

			return res.status(200).json({
				success: true,
				msg: 'successful',
				info: config,
			});
		} catch (error) {
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},

	getPickupLocations: async (req, res) => {
		try {
			const config = await Config.findOne({}).select('locations');

			return res.status(200).json({
				success: true,
				locations: config?.locations,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},
};
