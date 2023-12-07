const router = require('express').Router();
const passport = require('../config/passport.js');
const models = require('../models');

router.get('/login/auth/kakao',
	passport.authenticate('kakao', {
		scope:
			['profile_nickname', 'account_email', '	profile_image']
	}
	));

router.get("/logout", async (req, res, next) => {
	req.logout((err) => {
		req.session.destroy();
		if (err) {
			res.status(500).send('error 발생');
		} else {
			res.redirect(process.env.frontAddress);
		}
	});
});

router.get('/login/oauth2/code/kakao',
	passport.authenticate('kakao', {
		successRedirect: process.env.frontAddress + '/mypage',
		failureRedirect: process.env.frontAddress
	}), function (req, res) {
	});

module.exports = router;