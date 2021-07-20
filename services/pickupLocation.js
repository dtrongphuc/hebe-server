const PickupLocation = require('../models/pickupLocation.model');

module.exports = {
	getPickupLocations: async () => {
		try {
			const locations = await PickupLocation.find({});

			return {
				locations,
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	putPickupLocations: async (pickupLocationInput) => {
		try {
			const { pickup_locations } = pickupLocationInput;
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

			await PickupLocation.deleteMany({});
			await Promise.all(
				locations.map((location) =>
					PickupLocation.create({
						...location,
					})
				)
			);
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},
};
