var express = require('express');
var router = express.Router();
const {
  landingPage,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getProfile,
  updateProfile
} = require('../controllers')

const {
  asyncErrorHandler,
  isLoggedIn,
  isValidPassword,
  changePassword
} = require('../middleware')

/* GET home/landing page. */
router.get('/',
	asyncErrorHandler(landingPage)
);

/* GET /register. */
router.get('/register', getRegister)

/* POST /register. */
 router.post('/register',
 	asyncErrorHandler(postRegister)
);

 /* GET /register. */
router.get('/login', getLogin);

/* GET /register. */
router.post('/login',
	asyncErrorHandler(postLogin)
);

/* GET /logout */
router.get('/logout',getLogout)


/**GET profile */
router.get('/profile', isLoggedIn,
    asyncErrorHandler(getProfile)
)

<<<<<<< HEAD
/**PUT profile */
=======

router.get('/profile', isLoggedIn,
    asyncErrorHandler(getProfile)
)



>>>>>>> userProfile
router.put('/profile', isLoggedIn,
    asyncErrorHandler(isValidPassword),
    asyncErrorHandler(changePassword),
    asyncErrorHandler(updateProfile)
)


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
