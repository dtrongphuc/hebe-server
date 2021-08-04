const Discount = require('../models/discount.model');
const DiscountRule = require('../models/discountRule.model');
const moment = require('moment');

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
				code,
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
					code,
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
};
