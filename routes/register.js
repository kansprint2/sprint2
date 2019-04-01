var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');

var models = require('../models/');

var User = models.User;

router.get('/', middleware.isAllowed, function(req, res, next) {
    res.render('register', { errorMessages: 0, title: 'AC scrum vol2',
        pageName: 'admin_panel', username: req.user.username,
        isUser: req.user.is_user, success: 0 });
});

router.post('/', middleware.isAllowed, function (req, res, next) {
    var data = req.body;
    if (data.password !== data.password2) {
        req.flash('error', 'Passwords do not match.');
        res.render('register', { errorMessages: req.flash('error'), title: 'AC scrum vol2', pageName: 'admin_panel', username: req.user.username, isUser: req.user.is_user });
    }

    if (data.is_user === undefined) {
        data.is_user = 1;
    }

    User.save(data).then(function (createdUser) {
        req.flash('success', createdUser.username);
        res.render('register', { success: req.flash('success'), errorMessages: 0,
            title: 'AC scrum vol2', pageName: 'admin_panel',
            username: req.user.username, isUser: req.user.is_user });

    }, function (err) {
        req.flash('error', 'Error.');
        res.render('register', { errorMessages: req.flash('error'), success: 0,
            title: 'AC scrum vol2', pageName: 'admin_panel',
            username: req.user.username, isUser: req.user.is_user });
        // throw err;
    });
});

module.exports = router;
