const { Router } = require('express');
const rejection = require('../validations/rejection');
const { validateAddress } = require('../validations/address');
const {
	createNewAddress,
	getAllAddresses,
	getAddressById,
	putEditAddress,
	deleteAddressById,
	countAddresses,
	getDefaultAddress,
} = require('../../services/address');
const isAuth = require('../middlewares/isAuth');
const isUser = require('../middlewares/isUser');

const route = Router();

module.exports = (app) => {
	app.use('/account/address', isAuth, isUser, route);

	//POST NEW ADDRESS
	route.post('/', validateAddress, rejection, async (req, res, next) => {
		try {
			await createNewAddress(req.body, req.user);
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});
	//GET ALL ADDRESSES BY ACCOUNT
	route.get('/', async (req, res, next) => {
		try {
			const { addresses } = await getAllAddresses(req.user);
			return res.status(200).json({ success: true, addresses });
		} catch (error) {
			next(error);
		}
	});

	//GET ADDRESS BY ID
	route.get('/get', async (req, res, next) => {
		try {
			const { address } = await getAddressById(req.query);
			return res.status(200).json({ success: true, address });
		} catch (error) {
			next(error);
		}
	});

	//EDIT ADDRESS
	route.put('/edit', validateAddress, rejection, async (req, res, next) => {
		try {
			const { address } = await putEditAddress(req.body, req.user);
			return res.status(200).json({ success: true, address });
		} catch (error) {
			next(error);
		}
	});

	//DELETE ADDRESS
	route.delete('/delete', async (req, res, next) => {
		try {
			await deleteAddressById(req.body, req.user);
			return res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});

	//COUNT ADDRESS OF ACCOUNT
	route.get('/count', async (req, res, next) => {
		try {
			const { count } = await countAddresses(req.user);
			return res.status(200).json({ success: true, count });
		} catch (error) {
			next(error);
		}
	});

	//GET DEFAULT ADDRESS
	route.get('/default', async (req, res, next) => {
		try {
			const { address } = await getDefaultAddress(req.user);
			return res.status(200).json({ success: true, address });
		} catch (error) {
			next(error);
		}
	});
};
