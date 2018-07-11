var createError = require('http-errors');
var express = require('express');
// var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require("passport-local");
var session = require('express-session');
var sessionStore = new session.MemoryStore;
var expressValidator = require('express-validator');
var flash = require('connect-flash');
require('dotenv').config()

var User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function(err) {
  if (err) {
    console.log(`Error: ${err}`);
  }
  console.log(`MongoDB Connected`);
});

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  cookie: { 
    expires: 24*60*60*1000
   },
  store: sessionStore,
  saveUninitialized: true,
  resave: true,
  secret: 'general-assembly',
  duration: 24*60*60*1000, // 1 day
  activeDuration:24*60*60*1000
}));

app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport')(passport, LocalStrategy, User);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.');
    var root = namespace.shift();
    var formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg: msg,
      value: value
    }
  }
}));
//connect flash
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/api', apiRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;