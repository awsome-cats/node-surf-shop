
const fs    = require('fs')
//TEST: かいけつできていない
// const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`))
module.exports = {
    getUsers(req, res, next) {
        res.render('users', { message: 'Hello' })
    }
}