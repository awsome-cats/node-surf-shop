// const Review = require('../models/review')
const User = require('../models/user');
const Post = require('../models/post');
module.exports = {
    asyncErrorHandler: (fn) => (req, res, next)=> {
            Promise.resolve(fn(req, res, next))
            .catch(next)
    },
    // checkIfUserExists: async (req,res, next) => {
    //     let userExists = await User.findOne({'email': req.body.email})
    //     if(userExists) {
    //         req.session.error = 'こちらのEmailはすでに登録されています'
    //         return res.redirect('back')
    //     }
    //     next()
    // }
    /**
     *NOTE: isLoggedIn
     userがログインしているかどうかcheck
     */
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
    }
        // console.log('res', res.locals) // check ログインしていない場合のuser
        // console.log('isLoggedIn', req.session)

        // sessionにerrorがはいっていない
        req.session.error = 'ログインしてください'
        req.session.redirectTo = req.originalUrl
        res.redirect('/login')
    },
    /**NOTE:
     *ログインしているuserが投稿者であるかcheck
     このチェックがとおれば投稿の編集、削除,更新ができる　
     */
    isAuthor: async (req, res, next) => {
        const post = await Post.findById(req.params.id)
        if (post.author.equals(req.user._id)) {
            res.locals.post = post;
            return next()
        }
        req.session.error = 'アクセスできません'
        res.redirect('back')
    },

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
    /**パスワードの変更
     * NOTE: 送信されたデータはuserがログインしているときだからusernameをつかって認証をかける
     * authenticateはログインの要求をかける(user objectをあつかう)
     */
    isValidPassword: async (req ,res, next) =>{
        const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
        if(user) {
            // add user to res.locals
            res.locals.user = user;
            next();
        } else {
            req.session.error = 'パスワードが正しくありません'
            return res.redirect('/profile');
        }
    },
    changePassword: async (req, res, next) => {
        const {
            newPassword,
            confirmationPassword
        } = req.body;
        console.log('req.body', req.body)

        if (newPassword && confirmationPassword) {
            const { user } = res.locals;
            console.log('user', user)
            if (newPassword === confirmationPassword) {
                await user.setPassword(newPassword);
                next()
            } else {
                req.session.error = '新しいパスワードが一致しません'
                return res.redirect('/profile');
            }
        } else {
            next()
        }
    }

}