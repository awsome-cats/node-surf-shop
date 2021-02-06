const User = require('../models/user')

// module.exports = {
//     postRegister(req, res, next) {
//         const newUser = new User ({
//             username: req.body.username,
//             email: req.body.email,
//             image: req.body.image
//         });
//         User.register(newUser, req.body.password, (err) => {
//             if (err) {
//                 console.log('err while user register!', err);
//                 return next(err)
//             }
//             console.log('user registerd!');
//             req.redirect('/')
//         })
//     }
// }

// second test

module.exports = {
    postRegister(req, res, next) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });
        User.register(newUser,  req.body.password, (err) => {
            if(err) {
                console.log('エラーです!ユーザーは登録されませんでした。!', err)
                return next(err);
            }
            console.log('ユーザー登録されました')
            res.redirect('/')
        })
    }
}

// first test(not model)

// module.exports = {
//     postRegister(req, res, next) {
//         console.log('Post Register Test')
//         res.send('POST /register & Test')
//     }
// }