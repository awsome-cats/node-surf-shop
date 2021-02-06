const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('body-parser')
const bodyParser    = require('body-parser')
const passport      = require('passport')
const session       = require('express-session')


// Models
const User          = require('./models/user')

// Mongoose DB
const mongoose      = require('mongoose')



// require routes
const index   = require('./routes/index');
const posts   = require('./routes/posts');
const reviews = require('./routes/reviews');


const  app = express();



// Start DB connection
/**
 * local mongoDB
 * appインスタンス生成のあと
 */
mongoose.connect('mongodb://localhost:27017/surf-shop', {
  useNewUrlParser: true
}, () => console.log('connect to DB!!'))


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('we are connected!!')
})


// End DB connection

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');





app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// express-session
/**
 * passportを設定する前にsessionを開始する
 * sessionとは、サーバー側でクライアントの状態を管理する方法
 */
app.use(session({
  secret: 'marunoko',
  resave: false,
  saveUninitialized: true
}))





// configure passport & sessions(before use routes)
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// use routes
app.use('/', index);
app.use('/posts', posts);
app.use('/posts/:id/reviews', reviews);



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
