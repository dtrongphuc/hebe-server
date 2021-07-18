const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSettingSchema = new Schema(
	{
		banner: {
			src: String,
			public_id: String,
			title: String,
			link: String,
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
