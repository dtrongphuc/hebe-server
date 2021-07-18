const { Mongoose } = require('mongoose');
const Address = require('../models/address.model');

const unDefault = async (userId) => {
	const session = await Mongoose.startSession();
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
	createNewAddress: async (addressInput, user) => {
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
			} = addressInput;

			if (isDefault === 'true' || isDefault === true) {
				unDefault(user._id);
			}

			let newAddress = await Address.create({
				customer: user._id,
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
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	getAllAddresses: async (user) => {
		try {
			let addresses = await Address.find({
				customer: user?._id,
			})
				.select('-customer')
				.sort({ isDefault: -1 });

			return { addresses };
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	getAddressById: async ({ id }) => {
		try {
			if (!id) {
				return Promise.reject({
					success: false,
					msg: 'required id',
				});
			}

			let address = await Address.findById(id).select('-customer -_id');
			return {
				address,
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	putEditAddress: async (addressInput, user) => {
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
			} = addressInput;

			if (!_id) {
				return Promise.reject({
					success: false,
					msg: 'required id',
				});
			}

			if (isDefault === 'true' || isDefault === true) {
				unDefault(user._id);
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

			return {
				address: addressUpdated,
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	deleteAddressById: async (addressInput, user) => {
		try {
			const { id } = addressInput;
			if (!id) {
				return Promise.reject({
					success: false,
					msg: 'required id',
				});
			}

			const address = await Address.findById(id);
			if (address.isDefault === true) {
				let matched = await Address.find({
					customer: user?._id,
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
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	countAddresses: async (user) => {
		try {
			let count = await Address.countDocuments({
				customer: user?._id,
			});

			return {
				count,
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	getDefaultAddress: async (user) => {
		try {
			let address = await Address.findOne({
				customer: user?._id,
				isDefault: true,
			}).select('-_id -customer');

			return {
				address,
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},
};
