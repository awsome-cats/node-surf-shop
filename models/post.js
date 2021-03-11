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
 *NEED
 images
 *二つのプロパティ
    public_id: クラウディナリーのimageデータを編集、削除に使用する
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate')

const PostSchema = new Schema({
    title: String,
    price: String,
    description: String,
    images: [{ url: String, public_id:String}],
    location: String,
    coordinates:Array,
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
});
// if(!mongoose.models.Post) mongoose.model('Post', PostSchema)

PostSchema.pre('remove', async function() {
    const err = new Error('something went wrong')
    console.log('PostSchema err', err)
    await Review.remove({
        _id: {
            $in:this.reviews
        }
    });
});

PostSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Post',PostSchema)