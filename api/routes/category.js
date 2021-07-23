const { Router } = require('express');
const {
	getAllCategories,
	getCategoryCollections,
	categoriesLink,
	addNewCategory,
} = require('../../services/category');
const { validateCategory } = require('../validations/category');
const rejection = require('../validations/rejection');

const route = Router();

module.exports = (app) => {
	app.use('/category', route);

	// route.post(
	// 	'/create',
	// 	upload.single('image'),
	// 	groupController.createNewGroup
	// );

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

	route.get('/:path', async (req, res, next) => {
		try {
			const { info, products } = await getCategoryCollections(req.params);
			return res.status(200).json({ success: true, info, products });
		} catch (error) {
			next(error);
		}
	});

	route.post('/add', validateCategory, rejection, async (req, res, next) => {
		try {
			const { newCategory } = await addNewCategory(req.body);
			if (!newCategory) return res.status(500).json({ success: false });

			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});
};
