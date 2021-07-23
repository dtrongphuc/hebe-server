const { Router } = require('express');
const {
	getAllBrands,
	getBrandCollections,
	brandsLink,
} = require('../../services/brand');

const route = Router();

module.exports = (app) => {
	app.use('/brand', route);

	// route.post('/create', upload.single('image'), brandController.createNewBrand);

	route.get('/all', async (req, res, next) => {
		try {
			let { brands } = await getAllBrands();
			return res.status(200).json({ success: true, brands });
		} catch (error) {
			next(error);
		}
	});

	route.get('/link', async (req, res, next) => {
		try {
			const { brands } = await brandsLink();
			return res.status(200).json({ success: true, brands });
		} catch (error) {
			next(error);
		}
	});

	route.get('/:path', async (req, res, next) => {
		try {
			const { info, products } = await getBrandCollections(req.params);
			return res.status(200).json({ success: true, info, products });
		} catch (error) {
			next(error);
		}
	});
};
