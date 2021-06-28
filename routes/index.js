var express = require('express');
var router = express.Router();
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });
/**追加するmiddleware
 * updateProfile, getForgotPw, putForgotPw, getReset, putReset
 */
const {
  landingPage,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getProfile,
  updateProfile,
  getForgotPw,
  putForgotPw,
  getReset,
  putReset
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

/* POST /register.  name=image*/
 router.post('/register', upload.single('image'),
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



/**GET /profile */
router.get('/profile', isLoggedIn,
    asyncErrorHandler(getProfile)
)


/**PUT /profile */
router.put('/profile', isLoggedIn,
    upload.single('image'),
    asyncErrorHandler(isValidPassword),
    asyncErrorHandler(changePassword),
    asyncErrorHandler(updateProfile)
)

// getForgotPw
router.get('/forgot-password', getForgotPw)

// asyncErrorHandler(putForgotPw)
router.put('/forgot-password', asyncErrorHandler(putForgotPw))


// GET /reset/:token
// asyncErrorHandler(getRest)
router.get('/reset/:token',  asyncErrorHandler(getReset))

// Put /reset/:token
// asyncErrorHandler(putRest)
router.put('/reset/:token', asyncErrorHandler(putReset))
// router.delete('/profile/:user_id', (req, res) => {
//   res.send('POST /profile')
// })



module.exports = router;
