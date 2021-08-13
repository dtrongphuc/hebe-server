require('dotenv').config();
module.exports = {
	port: process.env.PORT || 8888,
	api: {
		prefix: '/api',
	},
	mongodb: process.env.MONGODB || 'mongodb://localhost:27017/hebe',
	cors: {
		origin: process.env.CLIENT_URL || 'http://localhost:3000',
		credentials: true,
	},
	client: {
		url: process.env.CLIENT_URL,
	},
	cloud: {
		name: 'du1435df8',
		api_key: '588658126729115',
	},
	password: {
		salt: 10,
	},
	email: {
		user: process.env.MAIL_USER,
		password: process.env.MAIL_PASSWORD,
	},
};
