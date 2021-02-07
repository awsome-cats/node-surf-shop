const Post = require('../models/post')

module.exports = {
    // Posts Index
    // posts/index.ejs
    async postIndex(req, res, next) {
        let posts = await Post.find({})
        res.render('posts/index', { posts })
    },



    // Posts New
    // posts/new.ejs
    // detabaseで投稿をさがすようなことはしないので非同期ではない
    postNew(req, res, next) {
        res.render('posts/new')
    },



    async postCreate(req, res, next) {
        // req.bodyが必要
        // postに代入した変数からidを取得し、リダイレクト
        let post = await Post.create(req.body.post)
        res.redirect(`/posts/${post.id}`)
    },



    // Post show
    async postShow(req,res, next) {
        let post = await Post.findById(req.params.id)
        res.render('posts/show', { post })
    },



    // Post edit
    async postEdit (req, res) {
        // res.send('Edit /posts/:id/edit')
       let post = await Post.findById(req.params.id)
       res.render('posts/edit', { post })
    },



    // Update post
    // new:trueをわたす必要
    async postUpdate(req, res, next) {
       let post = await Post.findByIdAndUpdate(req.params.id, req.body.post,{new:true})
       res.redirect(`/posts/${post.id}`)
    },
    // POST DELETE
    async postDestroy(req, res, next) {
        await Post.findByIdAndRemove(req.params.id)
        res.redirect('/posts')
    }
}