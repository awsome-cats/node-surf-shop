const User = require('../models/user')
const passport = require('passport')


// error Handlerを使用
module.exports = {
    // POST /register
    postRegister(req, res, next) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });
         User.register(newUser,  req.body.password)

        res.redirect('/')
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