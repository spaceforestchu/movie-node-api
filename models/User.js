var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var moment = require('moment');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true,  lowercase: true, default: ''},
    favorites: {type: Array},
    timestamp: {type: String, default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a") },
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserSchema', UserSchema);