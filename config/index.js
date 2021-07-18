require('dotenv').config();
module.exports = {
	port: process.env.PORT || 8888,
	api: {
		prefix: '/api',
	},
	cors: {
		origin: process.env.CLIENT_URI || 'http://localhost:3000',
		credentials: true,
	},
};
