var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res, next) {
    res.render('login', { errorMessages: req.flash('error') });
});

router.post('/', passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Invalid username or password.' }), function (req, res, next) {
    console.log("login post");
    req.session.save(function (err) {
        console.log('Auth complete');
        if (err) return next(err);
        res.redirect('/');
    })
});

module.exports = router;