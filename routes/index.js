var express = require('express');
var router = express.Router();
var middleware = require('./middleware.js');

/* GET home page. */
router.get('/', middleware.ensureAuthenticated, function(req, res, next) {
    res.redirect('dashboard');
});

module.exports = router;