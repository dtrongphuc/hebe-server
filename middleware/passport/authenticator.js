var JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt,
	passport = require('passport');
Account = require('../../models/account.model');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(
	new JwtStrategy(opts, async function (jwt_payload, done) {
		try {
			let account = await Account.findById(jwt_payload.sub);
			// Nếu tồn tại tài khoản
			if (account) {
				return done(null, account);
			}

			// Không tồn tại tài khoản
			return done(null, false);
		} catch (error) {
			return done(error, false);
		}
	})
);

module.exports = passport.authenticate('jwt', { session: false });
