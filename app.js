var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var db=require('./config/connection')
var session=require('express-session')
var session1=require('express-session')

var hbs = require('express-handlebars');
var hhbs = hbs.create({});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');

app.engine('hbs', hbs.engine({extname: 'hbs', defualtLayout : 'layout' , layoutsDir: __dirname +'/views/layout/',partialsDir:__dirname+'/views/partials/'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({secret:'key',cookie:{maxAge:600000}}))


db.connect((err)=>{
  if(err)
  console.log('db fail'+err);
  else
  console.log('db connected');
})


app.use('/', adminRouter);
app.use('/users', usersRouter);
 app.use('/admin',adminRouter); 



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


// handlebar comment

hhbs.handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

  if (arguments.length < 3)
    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

  operator = options.hash.operator || "==";
  
  var operators = {
    '==':		function(l,r) { return l == r; },
    '===':	function(l,r) { return l === r; },
    '!=':		function(l,r) { return l != r; },
    '<':		function(l,r) { return l < r; },
    '>':		function(l,r) { return l > r; },
    '<=':		function(l,r) { return l <= r; },
    '>=':		function(l,r) { return l >= r; },
    'typeof':	function(l,r) { return typeof l == r; }
  }

  if (!operators[operator])
    throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

  var result = operators[operator](lvalue,rvalue);

  if( result ) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
  
});

module.exports = app;
