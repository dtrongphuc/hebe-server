const express = require('express');
const cookies = require('cookie-parser');
const cors = require('cors');
const config = require('../config');
const routes = require('../api');

module.exports = (app) => {
	app.use(cors(config.cors));
	app.use(cookies());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	app.use(config.api.prefix, routes());

	//error handlers
	app.use((err, req, res, next) => {
		/**
		 * Handle 401 thrown by express-jwt library
		 */
		if (err.name === 'UnauthorizedError') {
			return res.status(err.status).send({ message: err.message }).end();
		}
		return next(err);
	});
	app.use((err, req, res, next) => {
		console.log(err);
		res.status(err.status || 500).send({
			success: false,
			errors: {
				message: err.message,
			},
		});
	});
};
