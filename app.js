var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');







var validate_move = require('./routes/validate_move');
var engine_move = require('./routes/engine_move');




var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
// app.use(cookieParser('secret_kaustav')); //needed for signed cookie

app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/users', usersRouter);



app.use('/validate_move',validate_move);
app.use('/engine_move',engine_move);






const { Chess } = require('chess.js')

var stockfish = require("stockfish");


app.locals.chess = new Chess(); //app.locals makes it available in other routes and views
app.locals.fen = ''; 


app.locals.engine = stockfish();











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
