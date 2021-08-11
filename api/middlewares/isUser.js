module.exports = (req, res, next) => {
	if (!req?.user || req?.user?.role !== 'user') {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	next();
};
