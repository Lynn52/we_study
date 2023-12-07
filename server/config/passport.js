var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const dotenv = require('dotenv').config();
const models = require('../models');
// passport.use(new GoogleStrategy({
//     clientID: process.env.googleClientId,
//     clientSecret: process.env.googleClientSecret,
//     callbackURL: process.env.callback,
//     passReqToCallback: true
// },

passport.use(new KakaoStrategy({
    clientID: process.env.kakaoClientId,
    callbackURL: process.env.callback,
},

    function (request, accessToken, refreshToken, profile, done) {
        console.log(profile)
        const user = {
            email: profile._json.kakao_account.email,
            nickName: profile.displayName,
            profileImage: profile._json.properties.profile_image
        }
        done(null, user);
    }
));

passport.serializeUser(function (user, done) {
    models.User.findOne({
        where: {
            email: user.email
        }
    }).then(data => {
        let userId = ''
        
        if (data === null) {
            models.User.create({
                email: user.email,
                nickName: user.nickName,
                downloadPath: user.profileImage

            }).then(data => {
                console.log(data.dataValues.id)
                userId = data.dataValues.id;
                done(null, userId);
            }).catch(err => {
                done(new Error('User Data Save Error'), null);
                console.log(err);
            })
        } else {
            done(null, data.dataValues.id);
        }
    }).catch(err => {
        done(new Error('User Data Find Error'), null);
        console.log(err);
    })
})

// 세션 유지
passport.deserializeUser(function (userId, done) {
    done(null, userId);
})

module.exports = passport;