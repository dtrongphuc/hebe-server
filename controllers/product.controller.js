const Product = require('../models/product.model');

let getFeaturedProduct = async (req, res) => {
	try {
		let products = await Product.find({}).populate('category').limit(10);
		return res.status(200).json(products);
	} catch (error) {
		return res.status(500).json({
			success: false,
		});
	}
};

let postProduct = async (req, res) => {
	try {
		const {
			name,
			category,
			price,
			saleprice,
			description,
			isStaffEdit,
			colors,
			sizes,
		} = req.body;

		let images = req.files.map((file) => file.path);

		await Product.create({
			name,
			category,
			price,
			saleprice,
			description,
			colors,
			sizeAndQuantity: sizes,
			images,
			isStaffEdit,
		});

		return res.status(200).json({
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
		});
	}
};

let getSingleProduct = async (req, res) => {
	try {
		const { productId } = req.params;

		if (!productId) {
			return res.status(403).json({
				success: false,
				error: 'productId is required',
			});
		}

		const productMatched = await Product.findById(productId).populate(
			'category'
		);

		return res.status(200).json(productMatched);
	} catch (error) {
		return res.status(500).json({
			success: false,
		});
	}
};

module.exports = {
	getFeaturedProduct,
	postProduct,
	getSingleProduct,
};
