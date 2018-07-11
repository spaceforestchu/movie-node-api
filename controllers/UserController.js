var User = require('../models/User');
var moment = require('moment');
var request = require('request');

module.exports = {
    createUser: function(params, callback) {
        User.register(new User({ username: params.username}), params.password, function(err, user) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, user);
            return;
        });
    },
    favoriteMovies: function(id, params, callback) {
        User.findByIdAndUpdate(id, {"$push": {"favorites": params}}, {new:true}, function(err, movie) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, movie);
        });
    },
    getUserFavoriteMovies: function(id) {
        return new Promise(function(resolve, reject) {
            User.findById(id, function(err, movies) {
                if (err) {
                    reject(err);
                    return;        
                }
                let moviesArray = movies.favorites;
    
                resolve(moviesArray);
                return;
            })
        })

    },
    
    getUserFavoriteMoviesByUserName: function(user, callback) {
        return new Promise(function(resolve, reject) {
            User.findOne({username: user}, function(err, user) {
                if (err) {
                    callback(err);
                    return;
                }

                let favoritesMovies = user.favorites;
        
                if (favoritesMovies.length === 0) {
                    reject("You don't have any favorite movies");
                } else {

                    let promisesArray = favoritesMovies.map(function(movie) {
                        return new Promise(function(resolve, reject) {
                            var url = "http://omdbapi.com/?apikey=6332b1e1&i=" + movie;

                            request(url, function(error, response, body) {
                                if (error) {
                                    return reject(error);
                                }
                                var data = JSON.parse(body)
                                // resolve once we have some data
                                return resolve(data);
                            });

                        });  
                    });
                    Promise.all(promisesArray)
                        .then(function(results) {
                            resolve(results);
                        })
                        .catch(function(error) {
                            reject(error);
                        })

                }

               
            })
        });
    
    }
}


