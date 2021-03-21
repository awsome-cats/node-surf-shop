const User = require('../models/user')
const Post = require('../models/post')
// const passport = require('passport')
const mapBoxToken = process.env.MAP_BOX_TOKEN

// error Handlerを使用
module.exports = {
    //Get /
    async landingPage(req,res, next) {
        const posts = await Post.find({})
        res.render('index', { posts, mapBoxToken, title:'Search By Map - Home' })
    },
    //GET /register
    getRegister(req, res,next) {
        res.render('register', {title: 'Register', username: '', email: ''})
    },
    /*NOTE:POST /register
      usernameとemailがすでにDBにある場合、登録は不可
      emailのみでも同じものがある場合も登録不可
      emailをチェックするためにつかったコード
       // eval(require('locus'))
    */
    async postRegister(req, res, next) {
        // const newUser = new User({
        //     username: req.body.username,
        //     email: req.body.email,
        //     image: req.body.image
        // });

        try {
            const  user = await User.register(new User(req.body),  req.body.password)
            console.log('user', user)
            req.login(user, function(err) {
                if (err) return next(err);
                req.session.success = `Welcome to Map Search, ${user.username}`
                res.redirect('/')
            })
        }catch(err) {
            const { username, email } = req.body
            let error = err.message;
            if(error.includes('duplicate') && error.includes('index: email_1 dup key')) {
                error =  'このEメールはすでにしようされています。'
            }
            res.render('register', {title: 'Register', username, email, error})
        }



        res.redirect('/')
    },
    // Get Login
    getLogin(req, res,next) {
        res.render('login', {title: 'login'})
    },
    /*NOTE:Post Login
    高階関数()(username, password)の部分がムズイ
    */
    async postLogin(req, res, next) {
       const { username, password } = req.body
       const { user, error } = await User.authenticate()(username, password)
       if (!user && error) return next(error)
       req.login(user, function(err) {
           if(err) return next(err);
           req.session.success = `Welcome back ${username}`
           const redirectUrl = req.session.redirectTo || '/';
           delete req.session.redirectTo;
           res.redirect(redirectUrl)
       })
    },
    // GET Logout
    getLogout (req, res, next) {
        req.logout()
        res.redirect('/')
    }
}

// second test

// module.exports = {
//     async postRegister(req, res, next) {
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