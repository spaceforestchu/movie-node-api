'use strict';
var express = require('express');
var router = express.Router();
var checkAuth = require('../middleware/checkAuth');
var request = require('request');
var UserController = require('../controllers/UserController');

router.get('/showfavorites', checkAuth.checkLoggedIn, function(req, res, next) {

  console.log(req.user)
  console.log(req.session.passport.user)
  var user = req.session.passport.user;

  UserController.getUserFavoriteMoviesByUserName(user)
    .then(function(results) {
     
      res.render('movieCards', {movies: results, user: req.user});
    })
    .catch(function(error) {
      res.json({
        message: error
      });
    })  

});

router.get('/getfavorites', function(req, res, next) {
  UserController.getUserFavoriteMovies(req.user._id)
    .then(function(movies) {
     res.send(movies);
    })  
    .catch(function(error) {
      res.send(error);
    });
});

router.post('/search', checkAuth.isLoggedIn, function(req, res, next) {
    var query = req.body.movie.trim();
    var url = `http://omdbapi.com/?apikey=${process.env.APIKEY}&s=${query}`;
    request(url, function(error, response, body){
        if (error) {
          res.json({
            confirmation: 'failure',
            message: error
          });
          return;
        }
        var data = JSON.parse(body)
        var results = data.Search;

        res.render('movieCards', {movies: results, user: req.user});
    });
});
  
router.get('/:id', checkAuth.isLoggedIn, function(req, res, next) {
  var id = req.params.id;
  var url = `http://omdbapi.com/?apikey=${process.env.APIKEY}&i=${id}`;
  request(url, function(error, response, body){
      if (error) {
        res.json({
          confirmation: 'failure',
          message: error
        });
        return;
      }
      var data = JSON.parse(body)
      res.render('movieCard', {movie: data, user: req.user});
  });
});

router.post('/favorites', function(req, res, next) {
  var id = req.user._id;
  var movieID = req.body.movieID;
  UserController.favoriteMovies(id,movieID, function(err, movie) {
    if (err) {
      console.log(err);
    }
    console.log(movie)
  });
});

module.exports = router;
  

