
var passportConf = require('../configs/passport');

var User = require('../models/user.model');
//var Geyser = require('../models/geyser.model');
//var imgUpload = require('../modules/imgUpload');
//var Multer = require('multer');
var _ = require('lodash');


module.exports = function (router, passport, async, flash) {
    router.get('/login', function (req, res) {
        if (req.user) { return res.json({ info: "success" }); }
        res.json({ info: "failed to login" });
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));


    router.get('/user/profile', function (req, res, next) {
        User.findOne({ _id: req.user._id }, function (err, user) {
            if (err) { return next(err); }
            res.json({ info: "success", data: user });
        });
    });


    router.get('/auth/logout', function (req, res, next) {
        req.logout();
        res.redirect("/");
    });

    router.post('/user/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.get('/users', function(req, res, next){
        User
        .find()
        .exec((err, users)=>{
            if(err){ return next(err)}
            res.status(200).json(users);
        })
    });

    router.get('/auth/geyser-request', function(req, res, next){
        User
        .find({boughtGeyser: true})
        .exec((err, users)=>{
            if(err){ return next(err)}
            res.status(200).json(users);
        })
    });

    router.post('/user/edit-profile', function (req, res, next) {
        User.findOne({ _id: req.user._id }, function (err, user) {
            if (err) { return next(err); }

            user.school = req.body.school;
            user.province = req.body.province;
            user.district = req.body.district;
            user.address = req.body.address;
            user.suburb = req.body.suburb;
            user.displayName = req.body.displayName;

            user.save(function (err) {
                if (err) { return next(err); }
                res.json({ info: "success" });
            });
        });
    });

    router.get('/auth/get-current-user', (req, res, next) => {
        if (req.user) {
            res.json({ user: req.user });
        } else {
            res.json({ user: false })
        };

    });

    //~ router.post('/user/change-picture', multer.single('image'), imgUpload.uploadToGcs, (req, res, next) => {
        //~ User.findById(req.user._id, (err, user) => {
            //~ if (err) { return next(err) }
            //~ user.picture = req.file.cloudStoragePublicUrl;
            //~ user.save(err => {
                //~ if (err) { return next(err) }
                //~ res.json({ response: "upload done" });
            //~ });
        //~ });
    //~ });


    router.put('/user/user-update/:id', function (req, res, next) {
        User.findById(req.params.id, function (err, user) {
            if (err) { return next(err); }
            _.merge(user, req.body);
            user.save(function (err) {
                if (err) { return next(err); }
                res.json({ response: "user succesfully updated" });
            });
        });
    });

    router.put('/api/user/buy-geyser/:id', function (req, res, next) {
        User.findById(req.params.id, function (err, user) {
            if (err) { return next(err); }
            user.boughtGeyser = true;
            user.save(function (err) {
                if (err) { return next(err); }
                res.json({ response: "Geyser Bought Succesfully" });
            });
        });
        
    });

    // router.put('/user/buy-geyser/:id', function (req, res, next) {
    //     User.findById(req.params.id, function (err, user) {
    //         if (err) { return next(err); }
    //         _.merge(user.role, "manager");
    //         user.save(function (err) {
    //             if (err) { return next(err); }
    //             res.json({ response: "Geyser Bought Succesfully" });
    //         });
    //     });
    // });
    router.get('/auth/google/login', passport.authenticate('google', {
        scope: ['profile', 'email']
    })
    );


    router.get('/auth/google/login/callback', passport.authenticate('google'), (req, res) => {
        res.redirect('/');
    });
    router.get('/auth/facebook/login',
        passport.authenticate('facebook'));

    router.get('/auth/facebook/login/callback',
        passport.authenticate('facebook'),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    router.delete('/user/:id', function (req, res, next) {
        User.findByIdAndRemove({ _id: req.params.id }, function (err) {
            if (err) { return next(err); }
            res.json({ info: "success" });
        });
    });


};
