const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet')
const session = require('express-session');
const secret = require('./config').secret;
const dotenv = require('dotenv').config();

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const transcriptRouter = require('./routes/transcript')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(session({ secret: secret, resave: false, saveUninitialized: false, cookie: { maxAge:  5000 } }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Access the session as req.session
// app.get('/', function(req, res, next) {
//   console.log(req.session);
//   if (req.session.valid) {
//     res.setHeader('Content-Type', 'text/html')
//     res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
//     res.end()
//   } else {
//     req.session.valid = true
//     res.end('Session has expired.')
//   }
// })

app.use('/admin', adminRouter);
app.use('/transcript', transcriptRouter);
app.use('/', indexRouter);

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
