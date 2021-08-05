const { Router } = require('express');
const {
	getDiscounts,
	createNewDiscount,
	toggleStatus,
	getDiscountById,
	editDiscount,
	applyDiscount,
} = require('../../services/discount');
const {
	validateNewDiscount,
	validateDiscount,
} = require('../validations/discount');
const rejection = require('../validations/rejection');

const route = Router();

module.exports = (app) => {
	app.use('/discount', route);

	route.get('/all', async (req, res, next) => {
		try {
			let { discounts } = await getDiscounts();
			return res.status(200).json({ success: true, discounts });
		} catch (error) {
			next(error);
		}
	});

	route.post(
		'/create',
		validateNewDiscount,
		rejection,
		async (req, res, next) => {
			try {
				const { discount } = await createNewDiscount(req.body);
				if (!discount) return res.status(500).json({ success: false });
				return res.status(200).json({ success: true });
			} catch (error) {
				next(error);
			}
		}
	);

	route.get('/toggle-status', async (req, res, next) => {
		try {
			let { discount } = await toggleStatus(req.query);
			if (!discount) return res.status(500).json({ success: false });
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});

	route.get('/by-id', async (req, res, next) => {
		try {
			let { discount } = await getDiscountById(req.query);
			if (!discount) return res.status(500).json({ success: false });
			return res.status(200).json({ success: true, discount });
		} catch (error) {
			next(error);
		}
	});

	route.post('/edit', async (req, res, next) => {
		try {
			let { discount } = await editDiscount(req.body);
			if (!discount) return res.status(500).json({ success: false });
			return res.status(200).json({ success: true, discount });
		} catch (error) {
			next(error);
		}
	});

	route.post('/apply', validateDiscount, rejection, async (req, res, next) => {
		try {
			let discount = await applyDiscount(req.user, req.body);
			if (!discount) return res.status(500).json({ success: false });
			return res.status(200).json({ success: true, discount });
		} catch (error) {
			next(error);
		}
	});
};
