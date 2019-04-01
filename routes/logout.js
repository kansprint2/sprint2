var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log('log out');
    req.logout();
    res.redirect('../login');
});

module.exports = router;