const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});
userSchema.plugin(passportLocalMongoose); // this will add on username & password fields to our schema

module.exports = mongoose.model('User', userSchema);

// can add on passport-twitter, passport-facebook, passport-google-outhen etc.
// More info:
// http://www.passportjs.org/packages/