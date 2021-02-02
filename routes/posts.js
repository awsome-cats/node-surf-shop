const express = require('express')
const router = express.Router()


/** GET posts index /posts */
router.get('/', (req, res) => {
    res.send('Index /posts')
})

// Get new        /posts/new
router.get('/new', (req, res) => {
    res.send('/posts/new')
})

// 3 Post create    /posts
router.post('/', (req, res) => {
    res.send('create /posts')
})

// Get show       /posts/:id
router.get('/:id', (req, res) => {
    res.send('show /posts/:id')
})

// Get edit       /posts/:id/edit
router.get('/:id/edit', (req, res) => {
    res.send('Edit /posts/:id/edit')
})

// PUT update     /posts/:id
router.put('/:id', (req, res) => {
    res.send('update /posts/:id')
})

// DELETE destroy /posts/:id
router.delete('/:id', (req, res) => {
    res.send('delete /posts/:id')
})


module.exports = router;

// GET index      /posts
// Get new        /posts/new
// Post create    /posts
// Get show       /posts/:id
// Get edit       /posts/:id/edit
// PUT update     /posts/:id
// DELETE destroy /posts/:id