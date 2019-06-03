var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.model');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var secret = require('./secret');


passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .populate('school')
        .exec(function (err, user) {
            done(err, user);
        });
});

passport.use(new GoogleStrategy(
    secret.google,
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id })
            .exec((err, user) => {
                if (err) { return done(err) }
                if (user) { return done(null, user) }
                var new_user = new User({
                    displayName: profile.displayName,
                    googleId: profile.id,
                    gender: profile.gender,
                    email: profile.emails[0].value,
                    picture: profile.photos[0].value,
                    profile: profile._json
                });
                new_user.save((err) => {
                    if (err) { return done(err) }
                    done(null, new_user);
                });
            })
    }
));

passport.use(new FacebookStrategy(
    secret.facebook,
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        User.findOne({ facebookId: profile.id })
            .exec((err, user) => {
                if (err) { return done(err) }
                if (user) { return done(null, user) }
                var new_user = new User({
                    displayName: profile.displayName,
                    facebookId: profile.id,
                    profile: profile._json
                });
                new_user.save((err) => {
                    if (err) { return done(err) }
                    done(null, new_user);
                });
            })
    }
));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {

    User.findOne({ email: email }, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        if (!user.comparePassword(password)) {
            return done(null, false);
        }
        return done(null, user);
    });
}));

exports.isAuthenticated = function (req, res, done) {
    if (req.isAuthenticated()) {
        return done();
    }
    res.json({ message: 'Unauthenticated' });
}
