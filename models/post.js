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
    geometry: {
        type: {
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    properties: {
        description: String
    },
    author:{
          type: Schema.Types.ObjectId,
          ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],

        //Fail Errorでページダウンする:section12
        avgRating: { type: Number, default: 0 }
});
// if(!mongoose.models.Post) mongoose.model('Post', PostSchema)

PostSchema.pre('remove', async function() {
    const err = new Error('something went wrong')
    // console.log('PostSchema err', err)
    await Review.remove({
        _id: {
            $in:this.reviews
        }
    });
});

PostSchema.methods.calculateAvgRating = function() {
    let ratingsTotal = 0;
    if(this.reviews.length) {
        this.reviews.forEach(review => {
            ratingsTotal += review.rating;
        });
        this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10)/10;
    } else {
        this.avgRating= ratingsTotal
    }


    const floorRating = Math.floor(this.avgRating)
    this.save();
    return floorRating;
}

PostSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Post',PostSchema)


/**
 * GeoJSON is a format for encoding a
 * variety of geographic data structures.
 */
/**
 * NOTE:
 *  geometry: {
        type: {
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    properties: {
        description: String
    },
 */