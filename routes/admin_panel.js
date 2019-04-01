var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');
var models  = require('../models');

var User = models.User;

/* GET admin page. */
router.get('/', middleware.isAllowed, async function(req, res, next) {

    User.findAllUsers().then(function (users) { //true == users + admins
        res.render('admin_panel', {
            users: users,
            title: 'AC scrum vol2',
            pageName: 'admin_panel',
            username: req.user.username,
            isUser: req.user.is_user,
            success: 0 });
    }, function (err) {
        throw err;
    })
});

module.exports = router;