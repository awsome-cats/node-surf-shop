const User = require('../models/user')
const Post = require('../models/post')
const AppError = require('../utils/appError')
const mapBoxToken = process.env.MAP_BOX_TOKEN
const util = require('util');




// error Handlerを使用
    //Get /
module.exports = {
    async landingPage (req,res, next) {
        const posts = await Post.find({})
        res.render('index', { posts, mapBoxToken, title:'Search By Map - Home' })
    },
    //GET /register
    async getRegister(req, res,next) {
        if(req.isAuthenticated()) return res.redirect('/')
        res.render('register', {title: 'Register', username: '', email: ''})
    },
    /*NOTE:POST /register
      usernameとemailがすでにDBにある場合、登録は不可
      emailのみでも同じものがある場合も登録不可
      emailをチェックするためにつかったコード
       // eval(require('locus'))
       NOTE:登録した後loginさせない方法として.req.loginを使わない方法
       const user = await User.register(new User(req.body),  req.body.password)
            req.session.success = `登録されました, ${user.username}`
            res.redirect('/login')
    */
    async postRegister(req, res, next) {
        // const newUser = new User({
        //     username: req.body.username,
        //     email: req.body.email,
        //     image: req.body.image
        // });

        try {
            const user = await User.register(new User(req.body),  req.body.password)
            if (!user) {
                return next(new AppError('ユーザー名がすでに存在してます'))
            }
            req.login(user, function(err) {
                if (err) {
                    return next(new AppError('ユーザー名がすでに存在します'))
                }
                req.session.success = `Welcome to Map Search, ${user.username}`
                res.redirect('/')
            })
        }catch(err) {
            const { username, email } = req.body
            if (username) {
                return next(new AppError('ユーザー名がすでに存在してます'))
            }
            let error = err.message;
            if(error.includes('duplicate') && error.includes('index: email_1 dup key')) {
                error =  'このEメールはすでに使用されています。'
            }
            res.render('register', {title: 'Register', username, email, error})
        }
    },
    // Get Login
    async getLogin(req, res,next) {
        if(req.isAuthenticated()) return res.redirect('/')
        /**
         * NOTE: ログインしていないuserが特定の投稿ページからレビューを作成しよう
         * としたときログインをもとめられるが、<a href="/login?returnTo=true">レビューを作成する</a>
         * このアンカータグからログインページに遷移した後,ログインすれば元の投稿ページに戻れる
         */
        if(req.query.returnTo) req.session.redirectTo = req.headers.referer;
        res.render('login', {title: 'login'})
    },
    /*NOTE:Post Login
    高階関数()(username, password)の部分がムズイ
    */
    async postLogin (req, res, next) {
       const { username, password } = req.body
       const { user } = await User.authenticate()(username, password)
    //    console.log('authenticate error', error)
    //    console.log('user', user)
        // const error = new Error('ユーザーが見つかりません')
       if (!user) {
        return next(new AppError('パスワードかユーザー名が違います'))
       }
       req.login(user, function(error) {
           if(error) return next(error);
           req.session.success = `Welcome back ${username}`
           const redirectUrl = req.session.redirectTo || '/';
           delete req.session.redirectTo;
           res.redirect(redirectUrl)
       })
    },
    // GET Logout
    async getLogout(req, res, next) {
        req.logout()
        res.redirect('/')
    },
    async getProfile(req,res, next) {
        const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
        res.render('profile', {posts})
    },
    async updateProfile(req, res, next) {
        const {
            username,
            email
        } = req.body;
        const { user } = res.locals;
        if (username) user.username = username;
        if (email) user.email = email;
        await user.save();
        /**
         * NOTE:util.promisify()引数にわたされた関数を簡単にプロミスオブジェクトにできる
         */
        const login = util.promisify(req.login.bind(req))
        await login(user);
        req.session.success = 'プロフィールが更新されました'
        res.redirect('/profile');
    }
}



// second test

// module.exports = {
//      postRegister(req, res, next) {
//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             image: req.body.image
//         });
//        try {
//         await User.register(newUser,  req.body.password)
//        }catch(err) {
//            console.log('err',err)
//            return next(err)
//        }
//        res.redirect('/')
//     }
// }

// first test(not model)

// module.exports = {
//     postRegister(req, res, next) {
//         console.log('Post Register Test')
//         res.send('POST /register & Test')
//     }
// }