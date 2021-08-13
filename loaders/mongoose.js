const mongoose = require('mongoose');
const config = require('../config');

module.exports = () => {
	mongoose
		.connect(config.mongodb, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		})
		.then(() => console.log('connected to database'))
		.catch((error) => console.log('error occured', error));
};
