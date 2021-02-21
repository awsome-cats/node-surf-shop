const Post = require('../models/post')
const Review = require('../models/Review')



module.exports = {



    // Reviews Create
    async reviewCreate(req, res, next) {
        // find the post by its id
        let post = await Post.findById(req.params.id)
        console.log('reviewCreate', post)

        // create the review
        // req.body.review.author = req.user._id
        let review = await Review.create(req.body.review)
        console.log('review', review)
        // assign review to post
        post.reviews.push(review);
        console.log('post', post)
        // redirect to the post
        post.save()
        req.session.success = 'レビューが投稿されました'
        res.redirect(`/posts/${post.id}`)

    },
    // Reviews Update
    async reviewUpdate(req, res, next) {

    },
    // Review DELETE
    async reviewDestroy(req, res, next) {

    }
}