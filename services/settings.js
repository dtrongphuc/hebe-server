const pageSetting = require('../models/pageSetting.model');
const { destroyFiles } = require('../helpers/cloudinary');

module.exports = {
	getBanner: async () => {
		try {
			let settings = await pageSetting.findOne({});
			return { banner: settings?.banner || null };
		} catch (error) {
			return Promise.reject(error);
		}
	},

	editBanner: async (bannerInput) => {
		try {
			const { title, collection, image } = bannerInput;
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
						collection,
						image,
					},
				});
			} else {
				settings.banner = {
					title,
					collection,
					image,
				};

				await settings.save();
			}
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
