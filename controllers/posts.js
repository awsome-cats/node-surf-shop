const Post = require('../models/post')
const cloudinary = require('cloudinary')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.ACCESS_TOKEN})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUD_SECRET
})


module.exports = {
    // Posts Index
    // posts/index.ejs
    async postIndex(req, res, next) {
        let posts = await Post.find({})
        res.render('posts/index', { posts, title: '投稿一覧' })
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

        let response = await geocodingClient
        .forwardGeocode({
            query: req.body.post.location,
            limit: 1
        })
        .send()
        req.body.post.coordinates = response.body.features[0].geometry.coordinates;

        let post = await Post.create(req.body.post)
        req.session.success = '投稿されました'
        console.log('req', req.session)
        res.redirect(`/posts/${post.id}`)
    },



    // Post show
    // Postのformの結果とReviewの結果をとる
    // optionsはレビューを降順で並べ替えてるだけ
    // populateでは関連のデータを取得する記述
    async postShow(req,res, next) {
        let post = await Post.findById(req.params.id).populate(
            {
                path: 'reviews',
                options: {sort: {'_Id': -1}},
                populate: {
                    path: 'author',
                    model: 'User'
                }
            });
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
    /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     *  存在する 画像の削除を扱う
     * 新規投稿の画像を扱う
     * * find the post by id
        * check if there's any images for deletion
        * assign deleteImages from req.body t its own variable
        * loop over deleteImages
            * delete images from cloudinary
            * delete image from post.images
        * check if there are any new images for upload*
        * upload images
            * add images to post.images array
        * update the post with new any new properties
        * save the updated post into the db
        * redirect to show page
     */
    async postUpdate(req, res, next) {
        // find the post by id
       let post = await Post.findById(req.params.id)
       console.log('postUpdate: postの中身', post)
       // 画像削除のプロセス
       // check if there's any images for deletion
       if (req.body.deleteImages && req.body.deleteImages.length) {
           // 変数に割り当てる
           let deleteImages = req.body.deleteImages;
           //loop over deleteImages
           for(const public_id of deleteImages) {
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                // delete image from post.images
                // postのimagesは配列なので複数形
                for (const image of post.images) {
                    if (image.public_id === public_id) {
                        console.log('削除されるimage.public_id', image.public_id)
                        let index = post.images.indexOf(image);
                        console.log('削除された画像のindex', index)
                        post.images.splice(index, 1);
                    }
                }
           }
       }
       // 画像が投稿されるプロセス
       // check if there are any new images for upload
       if (req.files) {
           // upload images
           for(const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path)
            console.log('edit:cloudinaryImage', image)
            // add images to post.images array
            post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            })
          }
       }
       // formから届くデータ:req.body.post.location
       // databaseから取得したデータ:post.location(冒頭で割り当てている)
       if (req.body.post.location !== post.location) {
            let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
            post.coordinates = response.body.features[0].geometry.coordinates;
            post.location = req.body.post.location
       }
       // 画像以外の投稿プロセス
       // update the post with new any new properties
       post.title = req.body.post.title
       post.description = req.body.post.description
       post.price = req.body.post.price

       //  save the updated post into the db
       post.save();
        // redirect to show page

       res.redirect(`/posts/${post.id}`);
    },
    // POST DELETE
    async postDestroy(req, res, next) {
        let post = await Post.findById(req.params.id)
        for (const image of post.images) {
            console.log('postDestroy', image)
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        res.redirect('/posts');
    }
}