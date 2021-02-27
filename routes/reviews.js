const express             = require('express')
// ネストされたparamsにアクセス
const router              = express.Router({ mergeParams: true}) // paramsのidにアクセスできる
const {asyncErrorHandler} = require('../middleware')

const {
    reviewCreate,
    isReviewAuthor,
    reviewUpdate,
    reviewDestroy

} = require('../controllers/reviews')


// Review reviews create    posts/:id/reviews
router.post('/',asyncErrorHandler(reviewCreate))


// PUT update  reviews   posts/:id/reviews/:review_id
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate))

// DELETE destroy reviews  posts/:id/reviews/:review_id
router.delete('/:review_id', isReviewAuthor, reviewDestroy)


module.exports = router;

// GET index      /posts
// Get new        /posts/new
// Post create    /posts
// Get show       /posts/:id
// Get edit       /posts/:id/edit
// PUT update     /posts/:id
// DELETE destroy /posts/:id