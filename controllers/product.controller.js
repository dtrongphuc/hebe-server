const Product = require('../models/product.model');
const ProductImages = require('../models/productImages.model');
const Variant = require('../models/variant.model');
const VariantDetail = require('../models/variant_detail.model');
const { nameToPath } = require('../utils/utils');

module.exports = {
	getAll: async (req, res) => {
		try {
			const products = await Product.find({}).populate('brand');
			return res.status(200).json({
				success: true,
				products,
			});
		} catch (error) {
			return res.status(404).json({
				success: false,
				message: error,
			});
		}
	},

	getFrontPageProducts: async (req, res) => {
		try {
			let products = await Product.find({})
				.populate('images')
				.populate('variants')
				.limit(10);
			return res.status(200).json(products);
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				success: false,
			});
		}
	},

	postProduct: async (req, res) => {
		try {
			const {
				name,
				brand,
				group,
				price,
				salePrice,
				description,
				variants,
				images,
			} = req.body;
			const path = nameToPath(name);

			let product = await Product.create({
				name,
				brand,
				group,
				price,
				salePrice,
				description,
				path,
			});

			let productImagesPromise = Promise.all(
				images.map((image, index) => {
					const { public_id, url } = image;
					return ProductImages.create({
						publicId: public_id,
						src: url,
						position: index + 1,
						product: product._id,
					});
				})
			);

			let productVariantsPromise = Promise.all(
				variants.map(async (variant) => {
					const { color, freeSize, stock, details } = variant;

					let variantDetails = await Promise.all(
						details.map((detail) => {
							return VariantDetail.create({
								size: detail.size,
								quantity: detail.quantity,
							});
						})
					);
					return Variant.create({
						color,
						freeSize,
						stock,
						details: variantDetails.map((detail) => detail._id),
						product: product._id,
					});
				})
			);

			let [productImages, productVariants] = await Promise.all([
				productImagesPromise,
				productVariantsPromise,
			]);

			product.variants = productVariants.map((variant) => variant._id);
			product.images = productImages.map((image) => image._id);
			product.save();

			return res.status(200).json({
				success: true,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				success: false,
			});
		}
	},

	getProductByPath: async (req, res) => {
		try {
			const { path } = req.params;

			if (!path) {
				return res.status(403).json({
					success: false,
					error: 'productPath is required',
				});
			}

			const productMatched = await Product.findOne({
				path: path,
			})
				.populate('brand')
				.populate('images')
				.populate({
					path: 'variants',
					populate: {
						path: 'details',
					},
				});

			return res.status(200).json(productMatched);
		} catch (error) {
			return res.status(500).json({
				success: false,
			});
		}
	},

	getProductById: async (req, res) => {
		try {
			const { productId } = req.params;
			if (!productId) {
				return res.status(403).json({
					success: false,
					error: 'productId is required',
				});
			}

			const productMatched = await Product.findById(productId).select('-__v');
			return res.status(200).json({
				success: true,
				product: productMatched,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
			});
		}
	},

	getEditProduct: async (req, res) => {
		try {
			const { productId } = req.params;
			if (!productId) {
				return res.status(403).json({
					success: false,
					error: 'productId is required',
				});
			}

			const productMatched = (
				await Product.findById(productId).select(
					'-__v -created_at -updatedAt -showing -path'
				)
			).toObject();
			let cloudImages = productMatched.images.map((image) => {
				return {
					...image,
					isDeleted: false,
				};
			});
			delete productMatched.images;
			return res.status(200).json({
				success: true,
				product: {
					...productMatched,
					cloudImages: cloudImages,
					images: [],
				},
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
			});
		}
	},
};
