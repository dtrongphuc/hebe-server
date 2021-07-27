const { Router } = require('express');
const {
	getAllBrands,
	getBrandCollections,
	brandsLink,
	addNewBrand,
	getBrandInfo,
	postEdit,
} = require('../../services/brand');
const { validateBrand } = require('../validations/brand');
const rejection = require('../validations/rejection');

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

	route.get('/info/:path', async (req, res, next) => {
		try {
			const { brand } = await getBrandInfo(req.params);
			return res.status(200).json({ success: true, brand });
		} catch (error) {
			next(error);
		}
	});

	// page with product
	route.get('/:path', async (req, res, next) => {
		try {
			const { info, products } = await getBrandCollections(req.params);
			return res.status(200).json({ success: true, info, products });
		} catch (error) {
			next(error);
		}
	});

	route.post('/add', validateBrand, rejection, async (req, res, next) => {
		try {
			const { newBrand } = await addNewBrand(req.body);
			if (!newBrand) return res.status(500).json({ success: false });

			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});

	//post edit
	route.post(
		'/edit/:path',
		validateBrand,
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
