const Product = require('../models/product.model');
const ProductImages = require('../models/productImages.model');
const Variant = require('../models/variant.model');
const VariantDetail = require('../models/variant_detail.model');
const Brand = require('../models/brand.model');
const { nameToPath } = require('../utils/utils');

module.exports = {
	getFrontPageProducts: async () => {
		try {
			let products = await Product.find({})
				.populate('images')
				.populate('variants')
				.limit(10);
			return { products };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getAllProducts: async () => {
		try {
			const products = await Product.find({}).populate('brand category');
			return { products };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	findProductByPath: async ({ path }) => {
		try {
			if (!path) {
				return Promise.reject({
					success: false,
					error: 'productPath is required',
				});
			}
			const productMatched = await Product.findOne({
				path: path,
			})
				.populate('brand')
				.populate('category')
				.populate('images')
				.populate({
					path: 'variants',
					populate: {
						path: 'details',
					},
				});
			return { product: productMatched };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	findProductById: async ({ productId }) => {
		try {
			if (!productId) {
				return Promise.reject({
					success: false,
					error: 'productId is required',
				});
			}

			const product = await Product.findById(productId).select('-__v');
			return { product };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	createNewProduct: async (productInput) => {
		try {
			const {
				name,
				brand,
				category,
				price,
				salePrice,
				description,
				variants,
				images,
			} = productInput;
			const path = nameToPath(name);

			let product = await Product.create({
				name,
				brand,
				category,
				price,
				salePrice,
				description,
				path,
			});

			let [productImages, productVariants] = await Promise.all([
				mapImages(images, product._id),
				mapVariants(variants, product._id),
			]);

			product.variants = productVariants.map((variant) => variant._id);
			product.images = productImages.map((image) => image._id);
			product.save();
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	postEdit: async ({ path }, productInput) => {
		try {
			const {
				name,
				category,
				brand,
				salePrice,
				price,
				description,
				variants,
				images,
			} = productInput;

			let product = await Product.findOneAndUpdate(
				{ path: path },
				{
					name,
					category,
					brand,
					salePrice,
					price,
					description,
				},
				{ new: true }
			).populate('variants');

			let [productImages, productVariants] = await Promise.all([
				mapImages(images, product._id),
				mapVariants(variants, product._id),
				Variant.deleteMany({ product: product._id }),
				VariantDetail.deleteMany({
					_id: {
						$in: product.variants?.map((variant) => variant.details).flat(),
					},
				}),
				ProductImages.deleteMany({ product: product._id }),
			]);

			product.variants = productVariants.map((variant) => variant._id);
			product.images = productImages.map((image) => image._id);
			product.save();

			return {
				success: true,
			};
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},
};

const mapImages = (images, productId) => {
	return Promise.all(
		images.map((image, index) => {
			const { public_id, url } = image;
			return ProductImages.create({
				publicId: public_id,
				src: url,
				position: index + 1,
				product: productId,
			});
		})
	);
};

const mapVariants = (variants, productId) => {
	return Promise.all(
		variants?.map(async (variant) => {
			const { color, freeSize, stock, details } = variant;

			let variantDetails =
				Array.isArray(details) && details.length > 0 && !freeSize
					? await Promise.all(
							details?.map((detail) => {
								return VariantDetail.create({
									size: detail.size,
									quantity: detail.quantity,
								});
							})
					  )
					: [];

			return Variant.create({
				color,
				freeSize: freeSize,
				stock,
				details: !freeSize ? variantDetails?.map((detail) => detail._id) : null,
				product: productId,
			});
		})
	);
};
