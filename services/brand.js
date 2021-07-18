const Brand = require('../models/brand.model');
const Product = require('../models/product.model');

module.exports = {
	getAllBrands: async () => {
		try {
			let brands = await Brand.find({});

			return {
				brands,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getBrandCollections: async ({ path }) => {
		try {
			const brand = await Brand.findOne({ path: path });

			const products = await Product.find({
				brand: brand._id,
			});

			return {
				info: brand,
				products,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
