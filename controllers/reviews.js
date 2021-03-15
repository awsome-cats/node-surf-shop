const Post = require('../models/post')
const Review = require('../models/review')



module.exports = {

    // Reviews Create
    /**
     *mongooseは非同期処理
     async awaitで記述しているため、コールバック関数よりawaitのほうが現実的
     exec()関数はコールバック関数の代わり
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async reviewCreate(req, res, next) {
        // find the post by its id
        let post = await Post.findById(req.params.id).populate('reviews').exec();
        // console.log('create review', post)
        let haveReviewed = post.reviews.filter(review => {
            return review.author.equals(req.user._id);
        }).length;

        if(haveReviewed){
            req.session.error = "1回の投稿に1回レビューできます"
            return res.redirect(`/posts/${post.id}`)
        }

        // console.log('reviewCreate', post)

        // create the review
        // userのログインができている場合投稿者の氏名が表示されるはず
        req.body.review.author = req.user._id
        let review = await Review.create(req.body.review);
        // console.log('review', review);
        // assign review to post
        post.reviews.push(review);
        // console.log('post', post);
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
        // posts collectionからreviewsデータを削除
        await Post.findByIdAndUpdate(req.params.id, {
            $pull: { reviews: req.params.review_id}
        })
        // reviews collectionからデータを削除
        await Review.findByIdAndRemove(req.params.review_id)
        req.session.success = 'レビューが削除されました';
        res.redirect(`/posts/${req.params.id}`);
    }
}