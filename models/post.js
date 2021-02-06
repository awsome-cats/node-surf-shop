/**
 * Post
 * title -string
 * price -string
 * description -string
 * images -array of string
 * location -string
 * lat -number
 * lng -number
 * autor - object id(ref user)
 * reviews - arru
 *
 */

const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: String,
    price: String,
    description: String,
    images: [String],
    location: String,
    lat: Number,
    lng: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author:
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
})

module.exports = mongoose.model('Post',PostSchema)