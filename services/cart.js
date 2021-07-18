const Variant = require('../models/variant.model');
const VariantDetail = require('../models/variant_detail.model');
const Cart = require('../models/cart.model');

module.exports = {
	fetchCart: async (user) => {
		try {
			const cart = await getCart(user._id);

			return { cart };
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	addToCart: async (productInfo, user) => {
		try {
			const { _id, sku, quantity } = productInfo;
			const [variant, variantDetail, cart] = await Promise.all([
				Variant.findById(_id).populate('product').populate('details'),
				VariantDetail.findById(sku).populate('variant'),
				Cart.findOne({
					account: user?._id,
				}).populate('product'),
			]);

			let price =
				variant.product?.salePrice > 0
					? variant.product.salePrice
					: variant.product.price;
			let total = price * quantity;
			let addProduct = {
				product: variant.product._id,
				variant: variant._id,
				sku: variantDetail?._id || null,
				quantity,
				total,
			};

			if (cart) {
				let { products } = cart;
				let hadProduct = !!variantDetail
					? products.find((item) => {
							return (
								String(item.product._id) === String(variant.product._id) &&
								String(item.sku._id) === String(variantDetail._id)
							);
					  })
					: products.find((item) => {
							return String(item.product._id) === String(variant.product._id);
					  });

				if (hadProduct) {
					hadProduct.quantity += quantity;
					hadProduct.total += total;
				} else {
					products.push(addProduct);
				}
				await cart.save();
				await updateCartPrice(cart._id);
			} else {
				await Cart.create({
					account: user?._id,
					products: [
						{
							...addProduct,
						},
					],
					totalPrice: addProduct.total,
				});
			}
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	updateCart: async (input, user) => {
		try {
			// action_type = 1, update quantity
			// action_type = 2, delete
			const { action_type, info, update } = input,
				{ cart_id, item_id } = info,
				{ old_quantity, quantity } = update;

			let updateResult = null;

			if (action_type === '1' || action_type === 1) {
				updateResult = await updateQuantity(cart_id, item_id, quantity);
			} else if (action_type === '2' || action_type === 2) {
				let found = await Cart.findByIdAndUpdate(cart_id, {
					$pull: {
						products: {
							_id: [item_id],
						},
					},
				});

				updateResult = {
					updated: !!found,
					msg: !!found ? '' : 'item not found',
				};
			}

			if (!updateResult?.updated) {
				return res.status(200).json({
					success: true,
					...updateResult,
				});
			}

			await updateCartPrice(cart_id);

			const updatedCart = await getCart(user?._id);

			return { cart: updatedCart, updateResult };
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},
};

const getCart = async (userId) => {
	const cart = await Cart.findOne({
		account: userId,
	}).populate({
		path: 'products',
		select: '-account',
		populate: [
			{
				path: 'product',
				select: '-variants -category -description -__v -showing',
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

	return cart;
};

const updateCartPrice = async (cartId) => {
	const cart = await Cart.findById(cartId);
	let totalPrice = cart?.products?.reduce(
		(total, current) => total + current.total,
		0
	);
	cart.totalPrice = totalPrice;
	await cart.save();
};

const updateQuantity = async (cart_id, item_id, quantity) => {
	const cart = await Cart.findById(cart_id).populate({
		path: 'products',
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

	let cartItem = cart.products.find((item) => String(item._id) === item_id);
	let price =
		cartItem.product?.salePrice > 0
			? cartItem.product.salePrice
			: cartItem.product.price;

	let stock = cartItem?.sku?.quantity || cartItem?.variant?.stock;
	if (quantity > 0 && quantity <= stock) {
		cartItem.quantity = parseFloat(quantity);

		cartItem.total = cartItem.quantity * price;
		await cart.save();

		return {
			updated: true,
			msg: '',
		};
	}

	if (quantity > stock) {
		cartItem.quantity = parseFloat(stock);

		cartItem.total = cartItem.quantity * price;
		await cart.save();

		return {
			updated: true,
			msg: `Maximum quantity: ${stock}`,
		};
	}

	return {
		updated: false,
		msg: 'error',
	};
};
