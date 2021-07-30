const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product.model');
const ShippingMethod = require('./shippingMethod.model');
const PickupLocation = require('./pickupLocation.model');
const autoIncrement = require('mongoose-auto-increment');
const moment = require('moment-timezone');

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
		deliveryMethod: {
			type: String,
			enum: ['shipment', 'pickup'],
			default: 'shipment',
		},
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
		shipmentStatus: {
			type: String,
			enum: ['pending', 'delivering', 'delivered'],
			default: 'pending',
		},
		paymentStatus: {
			type: String,
			enum: ['pending', 'paid', 'refunded'],
			default: 'paid',
		},
	},
	{ versionKey: false, timestamps: true }
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

autoIncrement.initialize(mongoose.connection);
orderSchema.plugin(autoIncrement.plugin, {
	model: 'Order',
	field: 'orderNumber',
	startAt: 1000,
	incrementBy: 1,
});

let Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;
