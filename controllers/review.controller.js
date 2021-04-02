const Review = require('../models/review.model');

let getReviews = async (req, res) => {
	try {
		let reviews = await Review.find({}).limit(6);
		return res.status(200).json(reviews);
	} catch (error) {
		return res.status(500).json({
			success: false,
			error,
		});
	}
};

module.exports = {
	getReviews,
};
