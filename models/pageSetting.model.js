const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSettingSchema = new Schema(
	{
		banner: {
			image: {
				src: String,
				publicId: String,
			},
			title: String,
			collection: {
				type: Schema.Types.ObjectId,
				ref: 'Brand',
			},
		},
	},
	{ versionKey: false, id: false }
);

const PageSetting = mongoose.model(
	'PageSetting',
	pageSettingSchema,
	'page_settings'
);

module.exports = PageSetting;
