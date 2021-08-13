const Brand = require('../models/brand.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

const sortKeywords = [
	{
		query: 'best-selling',
		sort: {
			sold: 'desc',
		},
	},
	{
		query: 'low-to-high',
		sort: {
			price: 'asc',
		},
	},
	{
		query: 'high-to-low',
		sort: {
			price: 'desc',
		},
	},
	{
		query: 'new-to-old',
		sort: {
			createdAt: 'desc',
		},
	},
	{
		query: 'old-to-new',
		sort: {
			createdAt: 'asc',
		},
	},
];

module.exports = {
	getCollections: async (
		{ path },
		{ page = 1, limit = 21, sort = 'best-selling' }
	) => {
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

			let sortField = sortKeywords.find(
				(item) => item.query === sort.toLowerCase()
			);
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
				.populate('brand')
				.sort(sortField?.sort)
				.skip((+page - 1) * limit)
				.limit(+limit);

			const maxPage = Math.ceil(products.length / +limit);

			return {
				info: category || brand,
				products,
				pagination: {
					current: page,
					max: maxPage,
					limit: limit,
				},
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},
};
