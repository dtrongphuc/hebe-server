const mongoose = require('mongoose');
const Address = require('../models/address.model');

const unDefault = async (userId) => {
	const session = await mongoose.startSession();
	await session.withTransaction(async () => {
		let hadDefault = await Address.findOne({
			customer: userId,
			isDefault: true,
		});

		if (hadDefault) {
			hadDefault.isDefault = false;
			await hadDefault.save();
		}
	});

	session.endSession();
};

module.exports = {
	createNewAddress: async (req, res) => {
		try {
			const {
				firstname,
				lastname,
				company,
				address,
				city,
				country,
				postal,
				phone,
				isDefault,
			} = req.body;

			if (isDefault === 'true' || isDefault === true) {
				unDefault(req.user._id);
			}

			let newAddress = await Address.create({
				customer: req.user._id,
				firstname,
				lastname,
				company,
				address,
				city,
				country,
				postal,
				phone,
				isDefault,
			});

			return res.status(200).json({
				success: true,
				msg: 'Add new address successful',
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},

	getAllAddresses: async (req, res) => {
		try {
			let addresses = await Address.find({
				customer: req.user?._id,
			})
				.select('-customer')
				.sort({ isDefault: -1 });

			return res.status(200).json({
				success: true,
				addresses,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},

	getAddressById: async (req, res) => {
		try {
			const { id } = req.query;
			if (!id) {
				return res.status(400).json({
					success: false,
					msg: 'required id',
				});
			}

			let address = await Address.findById(id).select('-customer -_id');
			return res.status(200).json({
				success: true,
				address,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},

	putEditAddress: async (req, res) => {
		try {
			const {
				_id,
				firstname,
				lastname,
				company,
				address,
				city,
				country,
				postal,
				phone,
				isDefault,
			} = req.body;

			if (!_id) {
				return res.status(400).json({
					success: false,
					msg: 'required id',
				});
			}

			if (isDefault === 'true' || isDefault === true) {
				unDefault(req.user._id);
			}

			let addressUpdated = await Address.findOneAndUpdate(
				{ _id: _id },
				{
					firstname,
					lastname,
					company,
					address,
					city,
					country,
					postal,
					phone,
				}
			);

			if (isDefault) {
				addressUpdated.isDefault = true;
				addressUpdated.save();
			}

			return res.status(200).json({
				success: true,
				address: addressUpdated,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},

	deleteAddressById: async (req, res) => {
		try {
			const { id } = req.body;
			if (!id) {
				return res.status(400).json({
					success: false,
					msg: 'required id',
				});
			}

			const address = await Address.findById(id);
			if (address.isDefault === true) {
				let matched = await Address.find({
					customer: req.user?._id,
					isDefault: false,
				})
					.sort({ _id: '-1' })
					.limit(1);
				if (matched.length > 0) {
					let newDefault = matched[0];
					newDefault.isDefault = true;
					await newDefault.save();
				}
			}

			await Address.findOneAndDelete({ _id: id });

			return res.status(200).json({
				success: true,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},

	countAddresses: async (req, res) => {
		try {
			let count = await Address.countDocuments({
				customer: req.user?._id,
			});

			return res.status(200).json({
				success: true,
				count,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},
};
