const Discount = require('../models/discount.model');
const DiscountRule = require('../models/discountRule.model');
const moment = require('moment');

module.exports = {
	getDiscounts: async () => {
		try {
			const discounts = await Discount.find({});

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
				status,
				customerSelection: condition_customer_email ? 'prerequisite' : 'all',
				productSelection: apply_to === 'specific_products' ? 'entitled' : 'all',
				entitledProduct:
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
				discountRule: rule._id,
			});

			return { discount };
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
