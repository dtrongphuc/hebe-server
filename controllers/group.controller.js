const Group = require('../models/group.model');
const Product = require('../models/product.model');
const cloudinary = require('../models/cloudinary.model');

module.exports = {
	createNewGroup: async (req, res) => {
		try {
			const { name, description } = req.body;
			const path = name.toLowerCase().replace(/ /g, '-');
			let result = await cloudinary.uploadGroupImage(req.file.path);
			await Group.create({
				name,
				path,
				image: result.url,
				description,
			});

			return res.status(200).json({
				success: true,
				message: 'create new group successful',
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error,
			});
		}
	},

	getAllGroups: async (req, res) => {
		try {
			let groups = await Group.find({});

			return res.status(200).json({
				success: true,
				groups,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: error,
			});
		}
	},

	getGroupCollections: async (req, res) => {
		try {
			const { path } = req.params;

			const group = await Group.findOne({ path: path });

			const products = await Product.find({
				group: group._id,
			});

			return res.status(200).json({
				success: true,
				data: {
					info: group,
					products,
				},
			});
		} catch (error) {
			return res.status(404).json({
				success: false,
				message: error,
			});
		}
	},
};
