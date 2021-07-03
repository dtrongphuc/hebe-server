const isEmpty = (value) => {
	return !value || typeof value === 'undefined';
};

module.exports = {
	validation: (req, res, next) => {
		const { name, brand, group, price, description, variants, images } =
			req.body;

		if (
			isEmpty(name) ||
			isEmpty(brand) ||
			isEmpty(group) ||
			isEmpty(price) ||
			isEmpty(description) ||
			isEmpty(variants) ||
			isEmpty(avatarIndex)
		) {
			return res.status(500).json({
				success: false,
				message: 'Empty data',
				type: 'Validation',
			});
		}
		next();
	},

	parseData: (req, res, next) => {
		try {
			const {
				name,
				brand,
				group,
				price,
				salePrice,
				description,
				variants,
				images,
			} = req.body;

			let path = JSON.parse(name).toLowerCase().replace(/\W+/g, '-');

			let imagesPath = req.files.map((file) => file.path);

			let quantity = JSON.parse(variants).reduce((qty, current) => {
				return (
					qty +
					current.details.reduce((detailQty, currentDetail) => {
						return detailQty + parseInt(currentDetail.quantity);
					}, 0)
				);
			}, 0);

			req.body = {
				...req.body,
				name: JSON.parse(name),
				brand: JSON.parse(brand),
				group: JSON.parse(group),
				price: parseInt(JSON.parse(price)),
				saleprice: parseInt(JSON.parse(saleprice)) || 0,
				description: JSON.parse(description),
				variants: JSON.parse(variants),
				avatarIndex: JSON.parse(avatarIndex),
				path,
				imagesPath,
				quantity,
			};

			next();
		} catch (error) {
			console.log('parse', error);
			return res.status(500).json({
				success: false,
				message: error,
				type: 'Parse data',
			});
		}
	},
};
