const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	content: String,
	image: String,
	date: String,
});

let Review = mongoose.model('Review', reviewSchema, 'reviews');

module.exports = Review;
