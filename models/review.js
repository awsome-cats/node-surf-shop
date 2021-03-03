/**
 * Review
 * body -string
 * author -object id (ref user)
 */

const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number, //評価
    author:
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
})

if(!mongoose.models.Review) mongoose.model('Review', ReviewSchema)

module.exports = mongoose.model('Review',ReviewSchema)