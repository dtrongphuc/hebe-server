const Order = require('../models/order.model');
const moment = require('moment');

const monthsOfTheYear = () => {
	let year = moment().year();
	return Array.from({ length: 12 }, (v, i) => i + 1).map((month) => ({
		_id: {
			month: month,
			year: year,
		},
		name: `${month}/${year}`,
		value: 0,
	}));
};

const convertNumber = (number) => {
	if (
		!number ||
		Number.isNaN(number) ||
		number == Number.POSITIVE_INFINITY ||
		number == Number.NEGATIVE_INFINITY
	) {
		return 0;
	}

	return number.toFixed();
};

module.exports = {
	getRevenue: async () => {
		try {
			let orders = await Order.aggregate([
				{
					$match: {
						createdAt: {
							$gte: new Date(moment().year(), 0),
							$lte: new Date(moment().year() + 1, 0),
						},
					},
				},
				{
					$group: {
						_id: {
							year: {
								$year: '$createdAt',
							},
							month: {
								$month: '$createdAt',
							},
						},
						value: {
							$sum: '$lastPrice',
						},
					},
				},
			]);

			let revenue = monthsOfTheYear().map((item) => {
				let index = orders.findIndex(
					(order) => order._id.month === item._id.month
				);
				if (index !== -1) {
					return {
						...item,
						value: orders[index].value,
					};
				}

				return item;
			});

			return {
				revenue,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	summaryMonth: async () => {
		try {
			let [inMonth, previousMonth] = await Promise.all([
				Order.find({
					createdAt: {
						$gte: new Date(moment().year(), moment().month()),
						$lt: new Date(moment().add(1, 'month')),
					},
				}),
				Order.find({
					createdAt: {
						$gte: new Date(moment().subtract(1, 'month')),
						$lt: new Date(moment().year(), moment().month()),
					},
				}),
			]);

			//average price
			let inMonthAverage =
				inMonth.reduce((total, current) => total + current.lastPrice, 0) /
				inMonth.length;

			let previousMonthAverage =
				previousMonth.reduce((total, current) => total + current.lastPrice, 0) /
				previousMonth.length;

			//product sold
			let inMonthSold = inMonth.reduce(
				(total, current) =>
					total +
					current.products.reduce(
						(subTotal, subCurrent) => subTotal + subCurrent.quantity,
						0
					),
				0
			);
			let previousMonthSold = previousMonth.reduce(
				(total, current) =>
					total +
					current.products.reduce(
						(subTotal, subCurrent) => subTotal + subCurrent.quantity,
						0
					),
				0
			);

			let totalOrdersComparison =
				((inMonth.length - previousMonth.length) * 100) / previousMonth.length;

			let averagePriceComparison =
				((inMonthAverage - previousMonthAverage) * 100) / previousMonthAverage;

			let productSoldComparison =
				((inMonthSold - previousMonthSold) * 100) / previousMonthSold;

			let summary = {
				totalOrders: {
					value: inMonth.length,
					comparison: convertNumber(totalOrdersComparison),
				},
				averagePrice: {
					value: inMonthAverage,
					comparison: convertNumber(averagePriceComparison),
				},
				productSold: {
					value: inMonthSold,
					comparison: convertNumber(productSoldComparison),
				},
			};

			return {
				summary,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
