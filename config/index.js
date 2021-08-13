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
	auth: {
		secretKey: process.env.SECRET_KEY,
		expires: process.env.EXPIRES,
	},
	cloud: {
		name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUD_API,
	},
	password: {
		salt: 10,
	},
	email: {
		user: process.env.MAIL_USER,
		password: process.env.MAIL_PASSWORD,
	},
};
