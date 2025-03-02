const router = require('express').Router();
const passport = require('../config/passport.js');

router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile','https://www.googleapis.com/auth/classroom.courses','https://www.googleapis.com/auth/classroom.rosters' ] }
));

router.get("/logout", async (req, res, next) => {
	req.logout((err) => {
		req.session.destroy();
		if (err) {
			res.redirect(process.env.frontAddress);
		} else {
			res.status(200).send("server ok: 로그아웃 완료");
		}
	});
});

router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: process.env.frontAddress,
        failureRedirect: process.env.frontAddress
}),function(req,res){
});
module.exports = router;