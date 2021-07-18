const Category = require('../models/category.model');
const Product = require('../models/product.model');

module.exports = {
	getAllCategories: async () => {
		try {
			let categories = await Category.find({});

			return {
				categories,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getCategoryCollections: async ({ path }) => {
		try {
			const category = await Category.findOne({ path: path });

			const products = await Product.find({
				category: category._id,
			});

			return {
				info: category,
				products,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
