var cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: 'du1435df8',
	api_key: '588658126729115',
	api_secret: 'c8oY9Abr4umqqMP75glZvn87XS0',
});

const uploadSingleFile = (file, folder) => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader
			.upload(file, {
				folder,
			})
			.then((result) => {
				if (result) {
					const fs = require('fs');
					fs.unlinkSync(file);
					resolve({
						url: result.secure_url,
						publicId: result.public_id,
					});
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
};

const uploadMultipleFiles = (files, folder) => {
	let resPromise = files.map((file) => uploadSingleFile(file, folder));
	return Promise.all(resPromise);
};

module.exports = {
	uploadBrandImage: (file) => {
		return uploadSingleFile(file, 'brands');
	},

	uploadProductImages: (files) => {
		return uploadMultipleFiles(files, 'products');
	},

	uploadGroupImage: (file) => {
		return uploadSingleFile(file, 'groups');
	},

	generateUploadSignature: async (folder) => {
		const timestamp = new Date().getTime();
		const signature = await cloudinary.utils.api_sign_request(
			{ timestamp, folder },
			'c8oY9Abr4umqqMP75glZvn87XS0'
		);

		return {
			timestamp,
			signature,
			folder,
		};
	},

	generateDestroySignature: async (public_id) => {
		const timestamp = new Date().getTime();
		const signature = await cloudinary.utils.api_sign_request(
			{ timestamp, public_id },
			'c8oY9Abr4umqqMP75glZvn87XS0'
		);

		return {
			timestamp,
			signature,
		};
	},
};
