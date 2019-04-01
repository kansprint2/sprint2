var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');

/* GET bootstrapTest page. */
router.get('/', middleware.ensureAuthenticated, function(req, res, next) {
  res.render('bootstrapTest', { title: 'AC scrum vol2', pageName: 'bootstrapTest', username: req.user.username, isUser: req.user.is_user });
});

module.exports = router;