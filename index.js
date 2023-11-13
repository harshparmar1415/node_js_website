var createError = require('http-errors');
var express = require('express');
var path = require('path');
var flash = require('express-flash');
var session = require('express-session');
var mysql = require('mysql');

var connection  = require('./lib/db');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/user');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



//const directory: string = path.join(__dirname, '/uploads');
//app.use('/uploads', express.static(directory));
//app.use(express.static('./public/images'));
//app.use('/images',express.static(__dirname+'/images'));
app.use(session({ 
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.course = req.session.course;
  res.locals.name =req.session.name;
 
  next();
});

app.use(flash());
app.use('/admin', adminRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(9978);
console.log("localhost:9978/admin");