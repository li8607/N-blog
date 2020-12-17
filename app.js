var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser')
const multer = require('multer')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signupRouter = require('./routes/signup');
var postsRouter =  require('./routes/posts');
var signoutRouter = require('./routes/signout');
var signinRouter = require('./routes/signin');

var app = express();

app.locals.blog = {
  title: 'N-blog',
  description: 'N-blog descriptionß'
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  saveUninitialized: false,
  secret: 'myblog',
  resave: true,
  store: new MongoStore({
    // 'mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb'
    url: 'mongodb://localhost:27017/myblog'
  })
}))
app.use(flash())

const upload = multer({dest: './public/images'})

app.use(upload.any())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/posts', postsRouter);
app.use('/signout', signoutRouter);
app.use('/signin', signinRouter);

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

if(module.parent) {
  module.exports = app;
}else {
  app.listen(3000, function() {
    console.log(`listening on port 3000`)
  })
}
