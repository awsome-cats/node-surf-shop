const Review = require('../models/review')
// const User = require('../models/user');
module.exports = {
    asyncErrorHandler: (fn) => (req, res, next)=> {
        Promise.resolve(fn(req, res, next))
        .catch(next)
    },
    isReviewAuthor: async(req, res, next) => {
        let review = await Review.findById(req.params.review_id);
        //equals mongoose methods: オブジェクト同士を照合する
        if(review.author.equals(req.user._id)) {
            return next();
        }
        req.session.error = "バイバイ"
        return res.redirect('/')
    },
    // checkIfUserExists: async (req,res, next) => {
    //     let userExists = await User.findOne({'email': req.body.email})
    //     if(userExists) {
    //         req.session.error = 'こちらのEmailはすでに登録されています'
    //         return res.redirect('back')
    //     }
    //     next()
    // }
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        console.log('res', res.locals) // check ログインしていない場合のuser
        console.log('isLoggedIn', req.session)

        // sessionにerrorがはいっていない
        req.session.error = 'ログインしてください'
        req.session.redirectTo = req.originalUrl
        res.redirect('/login')
    }

    /**
     * NOTE:req.sessionの中身
     * isLoggedIn Session {
        cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
        redirectTo: '/posts/new'
        }
     *
     */
        // isReviewAuthor: async(req, res, next) => {
        //     let review = await Review.findById(req.params.review_id);
        //     //equals mongoose methods: オブジェクト同士を照合する
        //     if(review.author.equals(req.user._id)) {
        //         return next();
        //     }
        //     req.session.error = "バイバイ"
        //     return res.redirect('/')
        // },

}