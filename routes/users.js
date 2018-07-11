'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var UserController = require('../controllers/UserController');

router.get('/signup', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }
  res.render('signup', {title: 'sign up'});
});

router.post('/signup', function(req, res, next) {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
        req.flash('error_msg', 'password does not match');
        res.redirect('/users/signup');
        return;
    }
    UserController.createUser(req.body, function(err, user) {
  
      if (err) {
        if (err.message === 'UserSchema validation failed') {
          req.flash('error_msg', 'UserSchema validation failed!');
          res.status(500).redirect('/users/signup');
          return;
        }
      }
      if (err.message === 'A user with the given username is already registered') {
        req.flash('error_msg', 'username already Exist!');
        res.status(500).redirect('/users/signup');
        return;
      }

      passport.authenticate('local')(req, res, function() {
        req.flash('success_msg', 'Success!');
        res.redirect('/');
        return;
       });
    });
});

router.get('/signin', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
    return;
    }
  res.render('signin', {title: 'Sign in'})
});

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/signin',
  failureFlash : { type: 'error_msg', message: 'Invalid username or password.' }
  }), function(req, res, next) {
  return;
});

router.get('/signout', function(req, res, next) {
  req.logout();
  res.redirect('/');
  return;
});
  

module.exports = router;
  
