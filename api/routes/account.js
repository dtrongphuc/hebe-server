const { Router } = require('express');
const rejection = require('../validations/rejection');
const isAuth = require('../middlewares/isAuth');
const { getUserAccounts } = require('../../services/account');

const route = Router();

module.exports = (app) => {
	app.use('/account', route);

	// get user accounts
	route.get('/users', async (req, res, next) => {
		try {
			const { accounts } = await getUserAccounts();
			return res.status(200).json({ success: true, accounts });
		} catch (error) {
			next(error);
		}
	});
};
