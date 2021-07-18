const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');

module.exports = (app) => {
	mongooseLoader();
	expressLoader(app);
};
