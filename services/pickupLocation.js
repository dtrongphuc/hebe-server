const PickupLocation = require('../models/pickupLocation');

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
};
