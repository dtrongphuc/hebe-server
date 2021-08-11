const { Router } = require('express');
const {
	getAllCategories,
	categoriesLink,
	addNewCategory,
	getCategoryInfo,
	postEdit,
	toggleActive,
} = require('../../services/category');
const { validateCategory } = require('../validations/category');
const rejection = require('../validations/rejection');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const route = Router();

module.exports = (app) => {
	app.use('/category', route);

	route.get('/all', async (req, res, next) => {
		try {
			const { categories } = await getAllCategories();
			return res.status(200).json({ success: true, categories });
		} catch (error) {
			next(error);
		}
	});

	route.get('/link', async (req, res, next) => {
		try {
			const { categories } = await categoriesLink();
			return res.status(200).json({ success: true, categories });
		} catch (error) {
			next(error);
		}
	});

	route.post(
		'/add',
		isAuth,
		isAdmin,
		validateCategory,
		rejection,
		async (req, res, next) => {
			try {
				const { newCategory } = await addNewCategory(req.body);
				if (!newCategory) return res.status(500).json({ success: false });

				return res.status(200).json({ success: true });
			} catch (error) {
				next(error);
			}
		}
	);

	route.get('/toggle-active', isAuth, isAdmin, async (req, res, next) => {
		try {
			await toggleActive(req.query);
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});

	route.get('/info/:path', async (req, res, next) => {
		try {
			const { category } = await getCategoryInfo(req.params);
			return res.status(200).json({ success: true, category });
		} catch (error) {
			next(error);
		}
	});

	route.post(
		'/edit/:path',
		isAuth,
		isAdmin,
		validateCategory,
		rejection,
		async (req, res, next) => {
			try {
				await postEdit(req.params, req.body);
				return res.status(200).json({ success: true });
			} catch (error) {
				next(error);
			}
		}
	);
};
