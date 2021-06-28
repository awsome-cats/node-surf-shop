const express = require('express')
const router = express.Router()
/**
 * NOTE:
 * multerオブジェクトで作成されたuploadsディレクトリは
 * uploadされる前に一時的に保存される場所
 * const upload = multer({'dest': 'uploads/'});
 */
const multer = require('multer')
/**
 * NOTE:storageに保存
 */
const { storage }= require('../cloudinary')
const upload = multer({ storage })


const { asyncErrorHandler, isLoggedIn,isAuthor } = require('../middleware')
const {
    postIndex,
    postNew,
    postCreate,
    postEdit,
    postShow,
    postUpdate,
    postDestroy
} = require('../controllers/posts')



/** GET posts
 *一覧表示
 Get
 3000/posts
 *
*/
router.get('/',asyncErrorHandler(postIndex))

/**NOTE:
 *  Get new
 * 新規投稿
 * 3000/posts/new
 * ログインしているか認証する必要がある
 */
router.get('/new', isLoggedIn, postNew)

/*NOTE:
Post create
*新規投稿
*3000/posts
*redirect(`/posts/${post.id}`)
upload: imagesとはformからしゅとくする入力の名前
4: 画像の最大数を表す
*ログインしているかが必要
*/
router.post('/',isLoggedIn, upload.array('images', 4),asyncErrorHandler(postCreate))

/**
 * Get show
 * それぞれの投稿 PAGE
 * 3000/posts/:id
 */
router.get('/:id', asyncErrorHandler(postShow))

/**
 * Get edit
 * formに投稿したデータを表示
 * 3000/posts/:id/edit
 */
router.get('/:id/edit', isLoggedIn,asyncErrorHandler(isAuthor), postEdit)

/**
 *  PUT update
 * formに投稿したデータの更新
 * 3000/posts/:id
 */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload.array('images', 4), asyncErrorHandler(postUpdate))

/**
 *  DELETE destroy
 * デリート
 * 3000/posts/:id
 */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postDestroy))


module.exports = router;

// GET index      /posts
// Get new        /posts/new
// Post create    /posts
// Get show       /posts/:id
// Get edit       /posts/:id/edit
// PUT update     /posts/:id
// DELETE destroy /posts/:id