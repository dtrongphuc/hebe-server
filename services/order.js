const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Variant = require('../models/variant.model');
const VariantDetail = require('../models/variant_detail.model');
const Discount = require('../models/discount.model');

const itemPerPage = 5;

module.exports = {
	createOrder: async (orderInput, user) => {
		try {
			const {
				billInfo,
				deliveryMethod,
				shippingMethod,
				pickupLocation,
				paymentMethod,
				discountCode,
			} = orderInput;

			// find products cart of user
			const { products } = await Cart.findOne({ account: user._id }).select(
				'-products.createdAt'
			);

			const discount = discountCode
				? await Discount.findOne({ code: discountCode.toUpperCase() }).populate(
						'discountRule'
				  )
				: null;

			let paymentStatus = paymentMethod === 'credit-card' ? 'paid' : 'pending';

			await Order.create({
				account: user._id,
				products: [...products],
				billInfo: {
					...billInfo,
				},
				deliveryMethod,
				shippingMethod,
				pickupLocation,
				paymentMethod,
				paymentStatus,
				discount: discount?._id ?? null,
				voucherPrice: 0,
			});

			// map products variant
			let mapped = await Promise.all(
				products.map(async (item) => {
					let [variant, sku] = await Promise.all([
						Variant.findById(item.variant),
						VariantDetail.findById(item.sku),
					]);

					return { variant, sku, quantity: item.quantity };
				})
			);

			// deduction stock quantity
			await Promise.all(
				mapped.map(async ({ variant, sku, quantity }) => {
					if (!variant.freeSize) {
						sku.quantity = sku.quantity - quantity;
						await sku.save();
					} else {
						variant.stock = variant.stock - quantity;
					}

					return await variant.save();
				})
			);

			// update sold quantity
			await Promise.all(
				products.map((item) => {
					return Product.findByIdAndUpdate(item.product, {
						$inc: {
							sold: +item.quantity,
						},
					});
				})
			);
			// clear user cart
			await Cart.findOneAndDelete({ account: user._id });
		} catch (error) {
			return Promise.reject(error);
		}
	},

	countOrder: async (user) => {
		try {
			const count = await Order.countDocuments({ account: user._id });
			return { count };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getOrdersOfUser: async ({ page }, user) => {
		try {
			const orders = await Order.find({ account: user._id })
				.limit(itemPerPage)
				.skip((page - 1) * itemPerPage)
				.populate([
					{
						path: 'products',
						populate: [
							{
								path: 'product',
								select: 'name path',
								populate: [
									{
										path: 'images',
										match: {
											position: 1,
										},
									},
								],
							},
							{
								path: 'variant',
							},
							{
								path: 'sku',
							},
						],
					},
					{
						path: 'shippingMethod',
					},
					{
						path: 'pickupLocation',
					},
				])
				.select('-account');

			return { orders };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	countPagination: async (user) => {
		try {
			const count = await Order.countDocuments({ account: user._id });
			const maxPage = Math.ceil(count / itemPerPage);
			return { maxPage };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getOrders: async () => {
		try {
			const orders = await Order.find({});
			return { orders };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	// get order by id
	getOrderById: async ({ id }) => {
		try {
			const order = await Order.findById(id).populate([
				{
					path: 'account',
					select: '-password -active',
				},
				{
					path: 'products',
					populate: [
						{
							path: 'product',
							select: 'name path',
							populate: [
								{
									path: 'images',
									match: {
										position: 1,
									},
								},
							],
						},
						{
							path: 'variant',
						},
						{
							path: 'sku',
						},
					],
				},
				{
					path: 'shippingMethod',
				},
				{
					path: 'pickupLocation',
				},
			]);

			return { order };
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
