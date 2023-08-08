const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({ 
    url: String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function(){ // virtual means info is not stored, just an instance to manipulate info and return it
    return this.url.replace('/upload','/upload/w_100');
})


const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({ // schema is like a format for data
    title: String,
    images: [imageSchema], // nested schema
    geometry: { // base on GeoJSON
        type: {
            type: String, 
            enum: ['Point'], // one option for type, hence type = 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // array of coordinates
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
            <p>${this.description.substring(0,20)}...</p>`; // pop-up markup with title and short description, take users to that campground page
})



const Review = require('./review');
CampgroundSchema.post('findOneAndDelete', async function(doc) { // middleware
    if (doc) { // if something is found that can be deleted
        await Review.deleteMany({  
            _id: { 
                $in: doc.reviews // remove reviews whose id is in doc.reviews
            }
        }) 
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema); // to compile and export the schema into mongoose