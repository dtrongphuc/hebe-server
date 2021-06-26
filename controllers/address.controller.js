const Address = require('../models/address.model');

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
				let hadDefault = await Address.findOne({
					customer: req.user._id,
					isDefault: true,
				});

				if (hadDefault) {
					hadDefault.isDefault = false;
					await hadDefault.save();
				}
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
			}).select('-customer');

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
};
