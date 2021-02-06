var express = require('express');
var router = express.Router();
const { postRegister } = require('../controllers/index.js')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Surf Shop - Home' });
});

/* GET /register. */
router.get('/register', (req, res) => {
  res.send('GET /register')
})

/* POST /register. */
 router.post('/register', postRegister);

/* GET /register. */
router.get('/login', (req, res,) => {
  res.send('GET /login');
});

/* GET /register. */
router.post('/login', (req, res,) => {
  res.send('POST /login');
});


router.get('/profile', (req, res) => {
  res.send('GET /profile')
})



router.put('/profile/:user_id', (req, res) => {
  res.send('POST /profile')
})


router.get('/forgot-pw', (req, res) => {
  res.send('GET /forgot-password')
})

router.put('/forgot-pw', (req, res) => {
  res.send('PUT /forgot-password')
})

router.get('/reset-pw/:token', (req, res) => {
  res.send('GET /rest-pw/:token')
})

router.put('/reset-pw/:token', (req, res) => {
  res.send('PUT /rest-pw/:token')
})
// router.delete('/profile/:user_id', (req, res) => {
//   res.send('POST /profile')
// })



module.exports = router;
