// const Review = require('../models/review')

module.exports = {
    asyncErrorHandler: (fn) => (req, res, next)=> {
            Promise.resolve(fn(req, res, next))
            .catch(next)
        },
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