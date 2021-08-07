const Discount = require('../models/discount.model');
const DiscountRule = require('../models/discountRule.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const moment = require('moment');
const { convertDiscountType } = require('../utils/utils');

module.exports = {
	getDiscounts: async () => {
		try {
			const discounts = await Discount.find({}).populate('discountRule');

			return { discounts };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	createNewDiscount: async (discountInput) => {
		try {
			const {
				code,
				discount_amount,
				discount_type,
				usage_limit,
				status,
				date_range,
				apply_to,
				condition_customer_email,
				condition_customer_purchase,
				description,
				one_per_customer,
				target_products,
			} = discountInput;

			let prerequisiteCustomers = await Promise.all(
				condition_customer_email
					.split(',')
					.filter((email) => email)
					.map((email) =>
						Account.findOne({ email: email.trim() }).select('_id')
					)
			);

			const rule = await DiscountRule.create({
				customerSelection: condition_customer_email ? 'prerequisite' : 'all',
				productSelection: apply_to === 'specific_products' ? 'entitled' : 'all',
				entitledProducts:
					apply_to === 'specific_products' ? [...target_products] : null,
				prerequisiteCustomers: prerequisiteCustomers, //
				customerPurchase: condition_customer_purchase,
				onePerCustomer: one_per_customer,
				startsAt: date_range ? moment(date_range[0]) : moment(),
				endsAt: date_range ? moment(date_range[1]) : null,
				targetType: apply_to === 'shipping' ? 'shipping_line' : 'line_item',
				usageLimit: usage_limit,
				value: discount_amount,
				valueType: discount_type,
			});

			const discount = await Discount.create({
				code: code.toUpperCase(),
				description,
				status,
				discountRule: rule._id,
			});

			return { discount };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	toggleStatus: async ({ id }) => {
		try {
			const discount = await Discount.findById(id);
			if (!discount) {
				return Promise.reject({
					success: false,
					message: 'Discount not found!',
				});
			}

			discount.status = !discount.status;
			await discount.save();
			return { discount };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	getDiscountById: async ({ id }) => {
		try {
			const discount = await Discount.findById(id).populate({
				path: 'discountRule',
				populate: [
					{
						path: 'prerequisiteCustomers',
						select: 'email',
					},
				],
			});

			return { discount };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	editDiscount: async (discountInput) => {
		try {
			const {
				id,
				code,
				discount_amount,
				discount_type,
				usage_limit,
				status,
				date_range,
				apply_to,
				condition_customer_email,
				condition_customer_purchase,
				description,
				one_per_customer,
				target_products,
			} = discountInput;

			let prerequisiteCustomers = await Promise.all(
				condition_customer_email
					.split(',')
					.filter((email) => email)
					.map((email) =>
						Account.findOne({ email: email.trim() }).select('_id')
					)
			);

			const discount = await Discount.findByIdAndUpdate(
				id,
				{
					code: code.toUpperCase(),
					description,
					status,
				},
				{ new: true }
			);

			const rule = await DiscountRule.findByIdAndUpdate(discount.discountRule, {
				customerSelection: condition_customer_email ? 'prerequisite' : 'all',
				productSelection: apply_to === 'specific_products' ? 'entitled' : 'all',
				entitledProducts:
					apply_to === 'specific_products' ? [...target_products] : null,
				prerequisiteCustomers: prerequisiteCustomers, //
				customerPurchase: condition_customer_purchase,
				onePerCustomer: one_per_customer,
				startsAt: date_range ? moment(date_range[0]) : moment(),
				endsAt: date_range ? moment(date_range[1]) : null,
				targetType: apply_to === 'shipping' ? 'shipping_line' : 'line_item',
				usageLimit: usage_limit,
				value: discount_amount,
				valueType: discount_type,
			});

			return { discount };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	applyDiscount: async (user, { code }) => {
		try {
			//get cart items of user
			const cart = await Cart.findOne({
				account: user?._id,
			}).populate({
				path: 'products',
				populate: {
					path: 'product',
				},
			});

			const discount = await Discount.findOne({
				code: code.toUpperCase(),
			}).populate('discountRule');
			const { discountRule } = discount;

			//check usage limit
			if (
				discountRule.usageLimit &&
				discount.usageCount >= discountRule.usageLimit
			) {
				return Promise.reject({
					location: 'check usage limit',
					message: 'Enter a valid discount code or gift card',
				});
			}

			//check date
			if (discountRule?.startsAt && discountRule?.endsAt) {
				if (
					moment() < moment(discountRule?.startsAt) ||
					moment() > moment(discountRule?.endsAt)
				) {
					return Promise.reject({
						message: 'Enter a valid discount code or gift card',
						location: 'check date',
					});
				}
			}

			//check customer purchase
			if (cart.totalPrice < discountRule.customerPurchase) {
				return Promise.reject({
					message: `Minimum order ${discountRule.customerPurchase}$`,
					location: 'check customer purchase',
				});
			}

			//check single use
			const orderCount = await Order.countDocuments({
				account: user?._id,
				discount: discount._id,
			});

			if (discountRule.onePerCustomer && orderCount >= 1) {
				return Promise.reject({
					message: 'Discount have been used',
					location: 'check single use',
				});
			}

			//check customer can use
			if (
				discountRule.customerSelection === 'prerequisite' &&
				!discountRule.prerequisiteCustomers.includes(user?._id)
			) {
				return Promise.reject({
					message: 'Enter a valid discount code or gift card',
					location: 'check customer can use',
				});
			}

			//check order items are target products of discount
			if (discountRule.productSelection === 'entitled') {
				let boolArr = cart.products.map((item) =>
					discountRule.entitledProducts.includes(item.product._id)
				);

				if (!boolArr.includes(true)) {
					return Promise.reject({
						message: 'Enter a valid discount code or gift card',
						location: 'check order items are target products of discount',
					});
				}
			}

			let display = {
				code: code.toUpperCase(),
				description: discount.description,
				target: discountRule.targetType,
				discountAmount: {
					value: 0,
					type: 'fixed_amount',
				},
				products: [],
			};

			if (
				discountRule.targetType === 'line_item' &&
				discountRule.allocationMethod === 'each'
			) {
				console.log('1');
				let reduction = 0;

				let products = cart.products
					.filter((item) =>
						discountRule.entitledProducts.includes(item.product._id)
					)
					.map((item) => {
						let amount = convertDiscountType(discountRule, item.total);

						reduction += amount;

						return {
							_id: item.product._id,
							price: item.total - amount,
						};
					});

				display = {
					...display,
					discountAmount: {
						value: reduction,
						// display type in client
						type: 'fixed_amount',
					},
					products,
				};
			} else if (discountRule.targetType === 'line_item') {
				console.log('2');

				display = {
					...display,
					discountAmount: {
						value: convertDiscountType(discountRule, cart.totalPrice),
						// display type in client
						type: 'fixed_amount',
					},
				};
			} else {
				display = {
					...display,
					discountAmount: {
						value: convertDiscountType(discountRule),
						// display type in client
						type: discountRule.valueType,
					},
				};
			}
			return display;
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
