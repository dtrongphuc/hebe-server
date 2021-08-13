const Review = require('../models/review.model');

module.exports = {
	getReviews: async () => {
		try {
			let reviews = await Review.find({}).limit(5);
			return { reviews };
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
