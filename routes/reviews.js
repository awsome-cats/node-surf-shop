const express = require('express')
// ネストされたparamsにアクセス
const router = express.Router({ mergeParams: true})


/** GET posts index posts/:id/reviews */
router.get('/', (req, res) => {
    res.send('Index  posts/:id/reviews')
})

// Get new        posts/:id/reviews/new
// router.get('/new', (req, res) => {
//     res.send(' posts/:id/reviews/new')
// })

// 3 Post create    posts/:id/reviews
router.post('/', (req, res) => {
    res.send('create  posts/:id/reviews')
})

// Get show      posts/:id /reviews/:review_id
// router.get('/review_id', (req, res) => {
//     res.send('show  posts/:id/reviews/:review_id')
// })

// Get edit       posts/:id/reviews/:review_id/edit
router.get('/:review_id/edit', (req, res) => {
    res.send('Edit  posts/:id/reviews/:review_id/edit')
})

// PUT update     posts/:id/reviews/:review_id
router.put('/:review_id', (req, res) => {
    res.send('update  posts/:id/reviews/:review_d')
})

// DELETE destroy /reviews/:id
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