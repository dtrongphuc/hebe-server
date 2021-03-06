const Category = require('../models/category.model');
const { nameToPath } = require('../utils/utils');
const { destroyFiles } = require('../helpers/cloudinary');

module.exports = {
	getAllCategories: async () => {
		try {
			let categories = await Category.find({}).sort({ name: 'asc' });

			return {
				categories,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	categoriesLink: async () => {
		try {
			let categories = await Category.find({ showing: true })
				.select('-_id name path')
				.sort({ name: 'asc' });

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
					publicId: image.publicId,
					src: image.src,
				},
			});

			return { newCategory };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getCategoryInfo: async ({ path }) => {
		try {
			const category = await Category.findOne({ path: path });

			return {
				category,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	postEdit: async ({ path }, categoryInput) => {
		try {
			const category = await Category.findOne({ path: path });
			if (category.image.publicId !== categoryInput.image.publicId) {
				await destroyFiles([category.image.publicId]);
			}

			await Category.findOneAndUpdate(
				{ path: path },
				{
					...categoryInput,
				}
			);

			return {
				success: true,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	// toggle showing
	toggleActive: async ({ id }) => {
		try {
			const category = await Category.findById(id);
			category.showing = !category.showing;
			await category.save();
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
