const Post = require('../models/post')
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

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
        req.body.post.images = []
        for(const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path)
            console.log('cloudinaryImage', image)
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            })
        }
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