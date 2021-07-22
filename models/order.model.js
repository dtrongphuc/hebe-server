const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product.model');
const ShippingMethod = require('./shippingMethod.model');
const PickupLocation = require('./pickupLocation.model');

const orderSchema = new Schema(
	{
		account: {
			type: mongoose.Types.ObjectId,
			ref: 'Account',
		},
		products: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					populate: { select: '_id price salePrice' },
				},
				variant: {
					type: Schema.Types.ObjectId,
					ref: 'Variant',
				},
				sku: {
					type: Schema.Types.ObjectId,
					ref: 'VariantDetail',
				},
				quantity: Number,
				total: Number,
			},
		],
		billInfo: {
			firstname: String,
			lastname: String,
			company: String,
			address: String,
			apartment: String,
			city: String,
			country: String,
			postal: String,
			phone: String,
		},
		deliveryMethod: String,
		shippingMethod: {
			type: Schema.Types.ObjectId,
			ref: 'ShippingMethod',
			required: false,
		},
		pickupLocation: {
			type: Schema.Types.ObjectId,
			ref: 'PickupLocation',
			required: false,
		},
		paymentMethod: String,
		productPrice: Number,
		shippingPrice: Number,
		voucherPrice: Number,
		lastPrice: Number,
		createdAt: {
			type: Date,
			default: function () {
				return Date.now();
			},
		},
	},
	{ versionKey: false }
);

orderSchema.pre('save', async function () {
	await Promise.all(
		this.products?.map(async (item) => {
			if (!item.total) {
				let pr = await Product.findById(item.product);
				item.total =
					(pr.salePrice > 0 ? pr.salePrice : pr.price) * item.quantity || 0;
			}
			return item.total;
		})
	);

	if (!this.productPrice) {
		this.productPrice = this.products?.reduce(
			(total, product) => total + product.total,
			0
		);
	}

	if (!this.shippingPrice) {
		if (this.shippingMethod) {
			let method = await ShippingMethod.findById(this.shippingMethod);

			this.shippingPrice = method.price;
		} else if (this.pickupLocation) {
			let location = await PickupLocation.findById(this.pickupLocation);

			this.shippingPrice = location.price;
		}
	}

	if (!this.lastPrice) {
		this.lastPrice = this.productPrice + this.shippingPrice - this.voucherPrice;
	}
});

let Order = mongoose.model('Order', orderSchema, 'orders');
module.exports = Order;
