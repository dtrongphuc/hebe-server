const { Router } = require('express');
const { getCollections } = require('../../services/collection');

const route = Router();

module.exports = (app) => {
	app.use('/collections', route);

	route.get('/:path', async (req, res, next) => {
		try {
			let { info, products, pagination } = await getCollections(
				req.params,
				req.query
			);
			return res
				.status(200)
				.json({ success: true, info, products, pagination });
		} catch (error) {
			next(error);
		}
	});
};
