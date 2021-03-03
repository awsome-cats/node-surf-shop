const Review = require('../../models/review')
const Post = require('../../models/posts')

module.exports = {
}

/**
 *
 * // postsを削除したときに発生するトリガー
// Posts collectionからpostsデータを削除しても、reviewsからは削除されない
// reviewsのidがあるpostsを削除したときにreviews collectionから自動的に関連reviewsも削除したい
// pre hook middleware
// arrow functionを使用すると空になる
// $in: included(含む)

PostSchema.pre('remove', async function() {
    const err = new Error('something went wrong')
    console.log('PostSchema err', err)
    await Review.remove({
        _id: {
            $in:this.reviews
        }
    });
});
 * asyncErrorHandler: (fn) => (req, res, next)=> {
            Promise.resolve(fn(req, res, next))
            .catch(next)
        },

    async postIndex(req, res, next) {
        let posts = await Post.find({})
        res.render('posts/index', { posts, title: '投稿一覧' })
    },
 */