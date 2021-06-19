const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema(
	{
		name: String,
		path: String,
		image: {
			publicId: String,
			link: String,
		},
		description: String,
		showing: {
			type: Boolean,
			default: true,
		},
	},
	{ versionKey: false }
);

let Group = mongoose.model('Group', groupSchema, 'groups');

module.exports = Group;
