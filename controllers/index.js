const User = require('../models/user')
const Post = require('../models/post')
const passport = require('passport')
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
        req.render('register', {title: 'Register'})
    },
    // POST /register
    async postRegister(req, res, next) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });
         let user = await User.register(newUser,  req.body.password)
         console.log('user', user)
         req.login(user, function(err) {
             if (err) return next(err);
             req.session.success = `Welcome to Map Search, ${user.username}`
             res.redirect('/')
         })

        res.redirect('/')
    },
    // Get Login
    getLogin(req, res,next) {
        req.render('login', {title: 'login'})
    },
    // Post Login
    postLogin(req, res, next) {
        passport.authenticate('local',
        {
        successRedirect: '/',
        failureRedirect: '/login'
        })(req, res, next)
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