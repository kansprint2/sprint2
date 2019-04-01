module.exports.ensureAuthenticated = function (req, res, next) {
    console.log('ensureAuthenticated MIDDLEWARE SAYS:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('ensureAuthenticated redirect');
    res.redirect('/login');
};

/**
 * If is admin if user is admin.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.isAllowed = function (req, res, next) {
    var user = req.user;
    if (req.isAuthenticated() && user && !user.is_user) {
        // console.log('isAllowed MIDDLEWARE SAYS:', req.isAuthenticated() && user);
        return next();
    } else {
        console.log('isAllowed MIDDLEWARE SAYS:', false);
        res.redirect('/');
    }
};