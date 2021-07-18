const {
	generateUploadSignature,
	generateDestroySignature,
} = require('../helpers/cloudinary');

module.exports = {
	requestSignature: async ({ folder }) => {
		try {
			const { timestamp, signature } = await generateUploadSignature(folder);
			return {
				timestamp,
				signature,
				folder,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},

	requestDestroySignature: async ({ public_id }) => {
		try {
			const { timestamp, signature } = await generateDestroySignature(
				public_id
			);
			return {
				timestamp,
				signature,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	},
};
