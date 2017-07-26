var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Verify = require('./verify');
var passport = require("passport");
var authenticate = require('../authenticate');

//facebook redirection and authentication api
router.get('/facebook', passport.authenticate('facebook'),
    function(req, res) {});

router.get('/facebook/callback', function (req, res, next) {
    // res.json(req);
    passport.authenticate('facebook', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user){
            return res.status(401).json({
                err: info
            })
        }
        req.logIn(user, function (err) {
            if (err){
                return res.status(500).json({
                    err: 'could not log in user'
                })
            }

            var token = Verify.getToken(user);

            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req,res,next);
});


module.exports = router;
