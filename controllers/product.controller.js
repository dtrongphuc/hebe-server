const Product = require('../models/product.model');

const cloudinary = require('../models/cloudinary.model');

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
			let products = await Product.find({}).limit(10);
			return res.status(200).json(products);
		} catch (error) {
			return res.status(500).json({
				success: false,
			});
		}
	},

	// Image handle by multer, call req.files
	postProduct: async (req, res) => {
		try {
			const {
				name,
				brand,
				group,
				price,
				saleprice,
				description,
				variants, // is array {color, {size, quantity}}
				avatarIndex,
				imagesPath,
				quantity,
				path,
			} = req.body;

			const imagesUrl = await cloudinary.uploadProductImages(imagesPath);

			await Product.create({
				name,
				brand,
				group,
				price,
				saleprice,
				description,
				variants,
				images: imagesUrl.map((image) => ({
					link: image.url,
					publicId: image.publicId,
				})),
				quantity,
				avatarIndex,
				path,
			});

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
			}).populate('brand');

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
					newImages: [],
				},
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
			});
		}
	},
};
