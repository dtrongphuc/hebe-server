const express = require('express');
let Router = express.Router();

const reviewController = require('../controllers/review.controller');

let initReviewAPI = (app) => {
	Router.get('/reviews', reviewController.getReviews);
	return app.use('/api', Router);
};

module.exports = initReviewAPI;
