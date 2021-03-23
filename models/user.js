const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    // email: String,
    /**NOTE:
     * uniqueにすることでemailの検証をやりやすくする
     */
    email: {type: String, unique: true, required: true,},
    image: String
})

var options = {
    MissingPasswordError: 'No password was given',
    AttemptTooSoonError: 'Account is currently locked. Try again later',
    TooManyAttemptsError: 'Account locked due to too many failed login attempts',
    NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
    IncorrectPasswordError: 'password is not ',
    IncorrectUsernameError: 'username is not',
    MissingUsernameError: 'No username was given',
    UserExistsError: 'A user with the given username is already registered'
};

UserSchema.plugin(passportLocalMongoose, options)
module.exports = mongoose.model('User',UserSchema)




/**
 * User
 * email - string
 * passsword - string
 * username - string
 * image - string
 * posts - array
 */
