const Brand = require('../models/brand.model');
const Group = require('../models/group.model');
const Product = require('../models/product.model');

module.exports = {
	getCollections: async (req, res) => {
		try {
			const { path } = req.params;

			const group = await Group.findOne({ path: path });
			const brand = await Brand.findOne({ path: path });

			const products = await Product.find({
				$or: [
					{
						group: group?._id,
					},
					{
						brand: brand?._id,
					},
				],
			});

			return res.status(200).json({
				success: true,
				info: group || brand,
				products,
			});
		} catch (error) {
			console.log(error);
			return res.status(404).json({
				success: false,
				message: error,
			});
		}
	},
};
