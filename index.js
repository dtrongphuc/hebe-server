const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const initProductAPI = require('./routes/api-Product.route');
const initReviewAPI = require('./routes/api-Review.route');
const initBrandAPI = require('./routes/api-Brand.route');
const app = express();

const port = 8080;

mongoose
	.connect('mongodb://localhost:27017/hebe', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log('connected to database'))
	.catch((error) => console.log('error occured', error));

const corsConfig = {
	origin: process.env.CLIENT_URI || 'http://localhost:3000',
	credentials: true,
};

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

initProductAPI(app);
initReviewAPI(app);
initBrandAPI(app);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
