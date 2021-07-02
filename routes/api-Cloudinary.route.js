const express = require('express');
const {
	generateUploadSignature,
	generateDestroySignature,
} = require('../helpers/cloudinary');
let Router = express.Router();

let initCloudinaryAPI = (app) => {
	Router.post('/image/upload/signature', async (req, res) => {
		try {
			const { folder } = req.body;
			const { timestamp, signature } = await generateUploadSignature(folder);
			return res.status(200).json({
				success: true,
				timestamp,
				signature,
				folder,
			});
		} catch (error) {
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	});

	Router.post('/image/destroy/signature', async (req, res) => {
		try {
			const { public_id } = req.body;
			const { timestamp, signature } = await generateDestroySignature(
				public_id
			);
			return res.status(200).json({
				success: true,
				timestamp,
				signature,
			});
		} catch (error) {
			return res.status(400).json({
				success: false,
				msg: error,
			});
		}
	});

	return app.use('/api/cloudinary', Router);
};

module.exports = initCloudinaryAPI;
