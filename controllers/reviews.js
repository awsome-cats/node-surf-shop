const Post = require('../models/post')
const Review = require('../models/Review')



module.exports = {

    // Reviews Create
    async reviewCreate(req, res, next) {
        // find the post by its id
        let post = await Post.findById(req.params.id)
        console.log('reviewCreate', post)

        // create the review
        // userのログインができている場合投稿者の氏名が表示されるはず
        req.body.review.author = req.user._id
        let review = await Review.create(req.body.review);
        console.log('review', review);
        // assign review to post
        post.reviews.push(review);
        console.log('post', post);
        // redirect to the post
        post.save();
        req.session.success = 'レビューが投稿されました'
        res.redirect(`/posts/${post.id}`);

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
    // Reviews Update
    async reviewUpdate(req, res, next) {
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = 'レビューが編集されました';
        res.redirect(`/posts/${req.params.id}`);
    },
    // Review DELETE
    /**POST$pull
     * 指定条件にマッチする要素を一つ削除
     * ややこしいが削除してから更新するらしい
     * REVIEW
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async reviewDestroy(req, res, next) {
        await Post.findByIdAndUpdate(req.params.id, {
            $pull: { reviews: req.params.review_id}
        })
        await Review.findByIdAndRemove(req.params.review_id)
        req.session.success = 'レビューが削除されました';
        res.redirect(`/posts/${req.params.id}`);
    }
}