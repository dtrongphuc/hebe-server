const express = require('express');
const config = require('./config');

const startServer = () => {
	const app = express();
	require('./loaders')(app);

	app.listen(config.port, () => {
		console.log(`Example app listening at http://localhost:${config.port}`);
	});
};

startServer();
