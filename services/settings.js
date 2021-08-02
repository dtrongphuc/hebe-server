const pageSetting = require('../models/pageSetting.model');
const { destroyFiles } = require('../helpers/cloudinary');

module.exports = {
	getBanner: async () => {
		try {
			let settings = await pageSetting.findOne({}).populate({
				path: 'banner',
				populate: {
					path: 'brand',
					select: '_id name path',
				},
			});
			return { banner: settings?.banner || null };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	editBanner: async (bannerInput) => {
		try {
			const { title, brand, image } = bannerInput;
			let settings = await pageSetting.findOne({});

			if (
				settings?.banner &&
				settings?.banner.image.publicId !== image.publicId
			) {
				await destroyFiles([settings.banner.image.publicId]);
			}

			if (!settings) {
				await pageSetting.create({
					banner: {
						title,
						brand,
						image,
					},
				});
			} else {
				settings.banner = {
					title,
					brand,
					image,
				};

				await settings.save();
			}
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
