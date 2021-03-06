const { Router } = require('express');
const { getRevenue, summaryMonth } = require('../../services/statistics');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const route = Router();

module.exports = (app) => {
	app.use('/statistics', isAuth, isAdmin, route);

	route.get('/revenue', async (req, res, next) => {
		try {
			const { revenue } = await getRevenue();
			return res.status(200).json({ success: true, revenue });
		} catch (error) {
			next(error);
		}
	});

	route.get('/summary', async (req, res, next) => {
		try {
			const { summary } = await summaryMonth();
			return res.status(200).json({ success: true, summary });
		} catch (error) {
			next(error);
		}
	});
};
