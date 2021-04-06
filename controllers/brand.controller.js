const Brand = require('../models/brand.model');
const cloudinary = require('../models/cloudinary.model');

module.exports = {
	createNewBrand: async (req, res) => {
		try {
			const { name, description } = req.body;
			const path = name.toLowerCase().replace(/ /g, '-');
			console.log('path');
			let result = await cloudinary.uploadBrandImage(req.file.path);
			await Brand.create({
				name,
				path,
				image: result.url,
				description,
			});

			return res.status(200).json({
				success: true,
				message: 'create new brand successful',
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error,
			});
		}
	},

	getAllBrands: async (req, res) => {
		try {
			let brands = await Brand.find({});

			return res.status(200).json({
				success: true,
				brands,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error,
			});
		}
	},
};
