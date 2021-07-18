const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

module.exports = {
	getCollections: async ({ path }) => {
		try {
			const category = await Category.findOne({ path: path });
			const brand = await Brand.findOne({ path: path });

			const products = await Product.find({
				$or: [
					{
						category: category?._id,
					},
					{
						brand: brand?._id,
					},
				],
			});

			return {
				info: category || brand,
				products,
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},
};
