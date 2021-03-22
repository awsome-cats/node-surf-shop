
var express = require('express');
var router  = express.Router();
const { getUsers } = require('../controllers/users')





router.get('/users', getUsers)

module.exports = router