const { Router } = require('express');
const rejection = require('../validations/rejection');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const {
	getUserAccounts,
	getAccountById,
	submitEditAccount,
} = require('../../services/account');
const { validateEditUserAccount } = require('../validations/account');

const route = Router();

module.exports = (app) => {
	app.use('/account', isAuth, isAdmin, route);

	// get user accounts
	route.get('/users', async (req, res, next) => {
		try {
			const { accounts } = await getUserAccounts();
			return res.status(200).json({ success: true, accounts });
		} catch (error) {
			next(error);
		}
	});

	// get user account by id
	route.get('/user', async (req, res, next) => {
		try {
			const { account } = await getAccountById(req.query);
			return res.status(200).json({ success: true, account });
		} catch (error) {
			next(error);
		}
	});

	// submit edit user account
	route.post(
		'/user/edit',
		validateEditUserAccount,
		rejection,
		async (req, res, next) => {
			try {
				const result = await submitEditAccount(req.body);
				return res.status(200).json({ success: result });
			} catch (error) {
				next(error);
			}
		}
	);
};
