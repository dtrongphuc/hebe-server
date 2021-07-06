const Variant = require('../models/variant.model');
const Cart = require('../models/cart.model');
const VariantDetail = require('../models/variant_detail.model');

module.exports = {
	addToCart: async (req, res) => {
		try {
			const { _id, sku, quantity } = req.body;
			const [variant, variantDetail, cart] = await Promise.all([
				Variant.findById(_id).populate('product').populate('details'),
				VariantDetail.findById(sku).populate('variant'),
				Cart.findOne({
					account: req.user._id,
				}).populate('product'),
			]);

			let price =
				variant.product?.salePrice > 0
					? variant.product.salePrice
					: variant.product.price;
			let total = price * quantity;
			console.log(variantDetail);
			let addProduct = {
				product: variant.product._id,
				variant: variant._id,
				sku: variantDetail._id,
				quantity,
				total,
			};

			if (cart) {
				let { products } = cart;
				let hadProduct = products.find((item) => {
					return (
						String(item.product._id) === String(variant.product._id) &&
						String(item.sku._id) === String(variantDetail._id)
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

	fetchCart: async (req, res) => {
		try {
			const cart = await Cart.findOne({
				account: req.user._id,
			}).populate({
				path: 'products',
				select: '-account',
				populate: [
					{
						path: 'product',
						select: '-variants -group -description -__v -showing',
						populate: [
							{
								path: 'brand',
								select: '_id name path',
							},
							{
								path: 'images',
								match: {
									position: {
										$eq: 1,
									},
								},
							},
						],
					},
					{
						path: 'sku',
					},
					{
						path: 'variant',
						select: '_id color stock freeSize',
					},
				],
			});

			return res.status(200).json({
				success: true,
				cart,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
			});
		}
	},

	updateCart: async (req, res) => {
		try {
			// action_type = 1, update quantity
			// action_type = 2, delete
			const { action_type, info, update } = req.body,
				{ cart_id, item_id } = info,
				{ old_quantity, quantity } = update;
			if (action_type === '1') {
				const cart = await Cart.findById(cart_id).populate({
					path: 'products',
					match: {
						_id: {
							$eq: item_id,
						},
					},
					populate: [
						{
							path: 'product',
						},
						{
							path: 'variant',
						},
						{
							path: 'sku',
						},
					],
				});
				if (!cart) {
					throw new Error('cart_id invalid');
				}

				const cartItem = cart.products && cart.products[0];
				let stock = cartItem?.sku?.quantity || cartItem?.variant?.stock;
				if (quantity > 0 && quantity <= stock) {
					cartItem.quantity = parseFloat(quantity);

					cartItem.total = cartItem.quantity * cartItem.product.price;
					await cart.save();
				}
			}
			const changes = await updateCartPrice(cart_id);
			return res.status(200).json({
				success: true,
				cart: changes,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({
				success: false,
			});
		}
	},
};

const updateCartPrice = async (cartId) => {
	const cart = await Cart.findById(cartId);
	let totalPrice = cart?.products?.reduce(
		(total, current) => total + current.total,
		0
	);
	cart.totalPrice = totalPrice;
	const saved = await cart.save();
	return saved;
};
