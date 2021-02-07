const express = require('express')
const router = express.Router()
const { asyncErrorHandler } = require('../middleware')
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

/**
 *  Get new
 * 新規投稿
 * 3000/posts/new
 */
router.get('/new', postNew)

/*Post create
*新規投稿
*3000/posts
*redirect(`/posts/${post.id}`)
*/
router.post('/', asyncErrorHandler(postCreate))

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
router.get('/:id/edit',asyncErrorHandler(postEdit))

/**
 *  PUT update
 * formに投稿したデータの更新
 * 3000/posts/:id
 */
router.put('/:id',asyncErrorHandler(postUpdate))

/**
 *  DELETE destroy
 * デリート
 * 3000/posts/:id
 */
router.delete('/:id', asyncErrorHandler(postDestroy))


module.exports = router;

// GET index      /posts
// Get new        /posts/new
// Post create    /posts
// Get show       /posts/:id
// Get edit       /posts/:id/edit
// PUT update     /posts/:id
// DELETE destroy /posts/:id