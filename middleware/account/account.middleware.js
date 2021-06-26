module.exports = {
	hashPassword: async (req, res, next) => {
		try {
			const { password } = req.body;

			const hashedPw = await bcrypt.hash(password, 10);

			res.locals.hashedPw = hashedPw;

			next();
		} catch (error) {
			return res.status(500).json({
				success: false,
				msg: error,
			});
		}
	},
};
