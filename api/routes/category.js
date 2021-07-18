const { Router } = require('express');
const {
	getAllCategories,
	getCategoryCollections,
} = require('../../services/category');

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

	route.get('/:path', async (req, res, next) => {
		try {
			const { info, products } = await getCategoryCollections(req.params);
			return res.status(200).json({ success: true, info, products });
		} catch (error) {
			next(error);
		}
	});
};
