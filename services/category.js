const Category = require('../models/category.model');
const Product = require('../models/product.model');
const { nameToPath } = require('../utils/utils');

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

	categoriesLink: async () => {
		try {
			let categories = await Category.find({ showing: true }).select(
				'-_id name path'
			);

			return {
				categories,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	addNewCategory: async (categoryInput) => {
		try {
			const { name, description, image } = categoryInput;
			let path = nameToPath(name);

			const newCategory = await Category.create({
				name,
				path,
				description,
				image: {
					publicId: image.public_id,
					src: image.url,
				},
			});

			return { newCategory };
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
