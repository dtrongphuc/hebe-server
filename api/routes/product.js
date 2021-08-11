const { Router } = require('express');
const {
	getFrontPageProducts,
	getAllProducts,
	findProductByPath,
	findProductById,
	createNewProduct,
	postEdit,
	toggleActive,
} = require('../../services/product');
const rejection = require('../validations/rejection');
const { validateProduct } = require('../validations/product');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const route = Router();

module.exports = (app) => {
	app.use('/product', route);

	route.get('/front-page', async (req, res, next) => {
		try {
			const { products } = await getFrontPageProducts();

			return res.status(200).json(products);
		} catch (error) {
			next(error);
		}
	});

	route.get('/all', async (req, res, next) => {
		try {
			const { products } = await getAllProducts();
			return res.status(200).json({
				success: true,
				products,
			});
		} catch (error) {
			next(error);
		}
	});

	route.get('/path/:path', async (req, res, next) => {
		try {
			const { product } = await findProductByPath(req.params);

			return res.status(200).json({
				success: true,
				product,
			});
		} catch (error) {
			next(error);
		}
	});

	route.get('/toggle-active', isAuth, isAdmin, async (req, res, next) => {
		try {
			await toggleActive(req.query);
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});

	route.get('/id/:productId', async (req, res, next) => {
		try {
			const { product } = await findProductById(req.params);

			return res.status(200).json({
				success: true,
				product,
			});
		} catch (error) {
			next(error);
		}
	});
	// route.get('/edit/id/:productId', productController.getEditProduct);
	route.post(
		'/create',
		isAuth,
		isAdmin,
		validateProduct,
		rejection,
		async (req, res, next) => {
			try {
				await createNewProduct(req.body);

				return res.status(200).json({
					success: true,
				});
			} catch (error) {
				next(error);
			}
		}
	);

	route.post(
		'/edit/:path',
		isAuth,
		isAdmin,
		validateProduct,
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
