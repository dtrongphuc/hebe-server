const { destroyFiles } = require('../helpers/cloudinary');
const Brand = require('../models/brand.model');
const Product = require('../models/product.model');
const { nameToPath } = require('../utils/utils');

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
	brandsLink: async () => {
		try {
			let brands = await Brand.find({ showing: true })
				.select('-_id name path')
				.sort({ name: 'asc' });

			return {
				brands,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	addNewBrand: async (brandInput) => {
		try {
			const { name, description, image } = brandInput;
			let path = nameToPath(name);

			const newBrand = await Brand.create({
				name,
				path,
				description,
				image: {
					publicId: image.publicId,
					src: image.src,
				},
			});

			return { newBrand };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getBrandInfo: async ({ path }) => {
		try {
			const brand = await Brand.findOne({ path: path });

			return {
				brand,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	postEdit: async ({ path }, brandInput) => {
		try {
			const brand = await Brand.findOne({ path: path });
			if (brand.image.publicId !== brandInput.image.publicId) {
				await destroyFiles([brand.image.publicId]);
			}

			await Brand.findOneAndUpdate(
				{ path: path },
				{
					...brandInput,
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
			const brand = await Brand.findById(id);
			brand.showing = !brand.showing;
			await brand.save();
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
