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

			let addProduct = {
				product: variant.product._id,
				variant: variant._id,
				sku: variantDetail?._id || null,
				quantity,
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
				} else {
					products.push(addProduct);
				}
				await cart.save();
				// await updateCartPrice(cart._id);
			} else {
				await Cart.create({
					account: user?._id,
					products: [
						{
							...addProduct,
						},
					],
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
				let found = await Cart.findByIdAndUpdate(
					cart_id,
					{
						$pull: {
							products: {
								_id: [item_id],
							},
						},
					},
					{ new: true }
				);
				updateResult = {
					updated: !!found,
					msg: !!found ? '' : 'item not found',
				};
			}

			if (!updateResult?.updated) {
				return Promise.reject({
					success: true,
					...updateResult,
				});
			}

			const updatedCart = await getCart(user?._id);

			return { cart: updatedCart, updateResult };
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		}
	},

	// check product quantity in cart less than product stock
	checkProductQuantity: async (user) => {
		try {
			const cart = await Cart.findOne({ account: user._id }).populate({
				path: 'products',
				populate: [
					{
						path: 'variant',
					},
					{
						path: 'sku',
					},
				],
			});

			let cartProductInvalid = cart.products?.filter((item) => {
				let [variantStock, skuStock] = [item.variant.stock, item.sku?.quantity];
				return item.variant.freeSize
					? item.quantity > variantStock
					: item.quantity > skuStock;
			});

			cartProductInvalid = cartProductInvalid.map((item) => item._id);

			return { invalid: cartProductInvalid };
		} catch (error) {
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

	let stock = cartItem?.sku?.quantity || cartItem?.variant?.stock;
	if (quantity > 0 && quantity <= stock) {
		cartItem.quantity = parseFloat(quantity);

		await cart.save();

		return {
			updated: true,
			msg: '',
		};
	}

	if (quantity > stock) {
		cartItem.quantity = parseFloat(stock);

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
