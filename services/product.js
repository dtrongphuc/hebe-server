const Product = require('../models/product.model');
const ProductImages = require('../models/productImages.model');
const Variant = require('../models/variant.model');
const VariantDetail = require('../models/variant_detail.model');
const Category = require('../models/category.model');
const { nameToPath } = require('../utils/utils');
const { destroyFiles } = require('../helpers/cloudinary');

module.exports = {
	getFrontPageProducts: async () => {
		try {
			let products = await Product.find({})
				.populate('images')
				.populate('variants')
				.limit(21)
				.sort({ created_at: 'desc' });
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

			let specialCategories = [];
			if (salePrice > 0) {
				const saleCategory = await Category.findOne({ path: 'sale' });
				specialCategories.push(saleCategory?._id);
			} else if (price < 50) {
				const under_50 = await Category.findOne({ path: 'under-50' });
				specialCategories.push(under_50?._id);
			} else if (price < 100) {
				const under_100 = await Category.findOne({ path: 'under-50' });
				specialCategories.push(under_100?._id);
			}

			let product = await Product.create({
				name,
				brand,
				category,
				specialCategories,
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

			let old_images = await ProductImages.find({ product: product._id });
			let deletePublicIds = old_images
				.filter((o) => !images.map((i) => i.publicId).includes(o.publicId))
				?.map((image) => image.publicId);

			let [productImages, productVariants] = await Promise.all([
				mapImages(images, product._id),
				mapVariants(variants, product._id),
				destroyFiles(deletePublicIds),
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

	// toggle showing
	toggleActive: async ({ id }) => {
		try {
			const product = await Product.findById(id);
			product.showing = !product.showing;
			await product.save();
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
// end exports

const mapImages = (images, productId) => {
	return Promise.all(
		images.map((image, index) => {
			const { publicId, src } = image;
			return ProductImages.create({
				publicId: publicId,
				src: src,
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
