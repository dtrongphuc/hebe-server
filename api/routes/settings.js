const { Router } = require('express');
const { getBanner, editBanner } = require('../../services/settings');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const route = Router();

module.exports = (app) => {
	app.use('/settings', route);

	route.get('/banner', async (req, res, next) => {
		try {
			const { banner } = await getBanner();
			return res.status(200).json({ success: true, banner });
		} catch (error) {
			next(error);
		}
	});

	route.post('/banner', isAuth, isAdmin, async (req, res, next) => {
		try {
			await editBanner(req.body);
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});
};
