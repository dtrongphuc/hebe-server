'use strict';
const nodemailer = require('nodemailer');
const { email } = require('../config');

// async..await is not allowed in global scope, must use a wrapper
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: email.user,
		pass: email.password,
	},
});

module.exports = transporter;
