const mongoose = require('mongoose');

module.exports = () => {
	mongoose
		.connect('mongodb://localhost:27017/hebe', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		})
		.then(() => console.log('connected to database'))
		.catch((error) => console.log('error occured', error));
};
