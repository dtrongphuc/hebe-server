const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

module.exports = {
	getCollections: async ({ path }, { page = 1, limit = 21, offset = 0 }) => {
		try {
			const [category, brand] = await Promise.all([
				Category.findOne({ path: path, showing: true }),
				Brand.findOne({ path: path, showing: true }),
			]);

			if (!category && !brand) {
				return Promise.reject({
					status: 404,
					message: 'page not found',
					success: false,
				});
			}

			const products = await Product.find({
				$or: [
					{
						category: category?._id,
					},
					{
						brand: brand?._id,
					},
					{
						specialCategories: {
							$in: [category?._id],
						},
					},
				],
			})
				.populate('images')
				.skip(page * offset)
				.limit(limit);

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
