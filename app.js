require('dotenv').config()
const createError   = require('http-errors');
const express       = require('express');
const engine        = require('ejs-mate');
const path          = require('path');
const logger        = require('morgan')
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser')
const passport      = require('passport')
const session       = require('express-session')
// Mongoose DB
const mongoose      = require('mongoose')
const methodOverride = require('method-override')
// Models
const User          = require('./models/user')

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
}, () => console.log('DBに接続されました'))


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('mongoose connection !!DBに接続されました　')
})

// End DB connection

// use engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware Start
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// method Override
app.use(methodOverride('_method'));

// express-session
/**
 * [位置]passportを設定する前にsessionを開始する
 * sessionとは、サーバー側でクライアントの状態を管理する方法
 */
app.use(session({
  secret: 'marunoko',
  resave: false,
  saveUninitialized: true
}))



app.use(passport.initialize());
app.use(passport.session());

// configure passport & sessions(before use routes)
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())




// Set title middleware
app.use(function(req,res, next) {
  // trick loginUser
  req.user = {
    "_id" : "603980232aa2204fa436c152",
    "username" : "kenny"
  }
  res.locals.currentUser = req.user;
  res.locals.title = 'Surf Shop';
  // 成功したとき
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // エラーの時
  res.locals.error = req.session.error || '';
  delete req.session.error;
  next();
})

// Middleware End





// Mount routes
app.use('/', index);
app.use('/posts', posts);
app.use('/posts/:id/reviews', reviews);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
 const err = new Error('お探しのページがみつかりません');
 err.status = 404;
 next(err);
});

// error handler
app.use(function(err, req, res, next) {
  //set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log('middleware:err', err);
  req.session.error = err.message;
  res.redirect('back');
});


module.exports = app;
