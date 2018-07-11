var User = require('../models/User');

module.exports = {
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Sign up or sign in to use the api');
        res.redirect('/users/signin');
    },
    checkLoggedIn: function(req, res, next) {
        let user = req.session.passport.user;
        if (user !== null || user !== undefined) {
            User.findOne({username: user}, function(err, user) {
                req.user = user;
                return next();
            });
        }

    }
}