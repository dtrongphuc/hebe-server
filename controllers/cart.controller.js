const Variant = require('../models/variant.model');
const Cart = require('../models/cart.model');

module.exports = {
	addToCart: async (req, res) => {
		try {
			const { _id, sku, quantity } = req.body;
			const variant = await Variant.findById(_id).populate('product');

			let cart = await Cart.findOne({
				account: req.user._id,
			}).populate('product');

			let price =
				variant.product?.salePrice > 0
					? variant.product.salePrice
					: variant.product.price;
			let total = price * quantity;

			let addProduct = {
				product: variant.product._id,
				variant: variant._id,
				sku,
				quantity,
				total,
			};

			if (cart) {
				let { products } = cart;
				let hadProduct = products.find((item) => {
					return (
						String(item.product._id) === String(variant.product._id) &&
						item.sku === sku
					);
				});

				if (hadProduct) {
					hadProduct.quantity += quantity;
					hadProduct.total += total;
				} else {
					products.push(addProduct);
				}
				cart.totalPrice += total;

				await cart.save();
			} else {
				await Cart.create({
					account: req.user._id,
					products: [
						{
							...addProduct,
						},
					],
					totalPrice: addProduct.total,
				});
			}

			return res.status(200).json({
				success: true,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	},
};
