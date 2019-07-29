const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const logger = require('morgan');
const path = require('path');
const enforce = require('express-sslify');
const session = require('express-session');
const passport = require('passport');

require('dotenv').config();
require('./models');
require('./config/passport');

const transcript = require('./routes/transcript');
const login = require('./routes/login');
const register = require('./routes/register');
const about = require('./routes/about');
const submission = require('./routes/submission');


const app = express();

// HTTPS Enforcement 
if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS());
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
  app.use(session({
    secret: process.env.secret,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1800000, // 30 mins
    },
  }));
} else {
  app.use(session({
    secret: 'secret',
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1800000, // 30 mins
    },
  }));
}

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', transcript);
app.use('/login', login)
app.use('/register', register)
app.use('/about', about)
app.use('/submission', submission)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
