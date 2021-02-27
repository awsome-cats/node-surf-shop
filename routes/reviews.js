const express             = require('express')
// ネストされたparamsにアクセス
const router              = express.Router({ mergeParams: true}) // paramsのidにアクセスできる
const {asyncErrorHandler} = require('../middleware')
const {
    reviewCreate,
    reviewUpdate,
    reviewDestroy

} = require('../controllers/reviews')


// Review reviews create    posts/:id/reviews
router.post('/',asyncErrorHandler(reviewCreate))


// PUT update  reviews   posts/:id/reviews/:review_id
router.put('/:review_id', asyncErrorHandler(reviewUpdate))

// DELETE destroy reviews  /reviews/:id
router.delete('/:review_id', (req, res) => {
    res.send('delete  posts/:id/reviews/:review_id')
})


module.exports = router;

// GET index      /posts
// Get new        /posts/new
// Post create    /posts
// Get show       /posts/:id
// Get edit       /posts/:id/edit
// PUT update     /posts/:id
// DELETE destroy /posts/:id