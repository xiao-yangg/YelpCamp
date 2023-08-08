// ********************************************
// SERVER SIDE VALIDATION BEFORE DATABASE (JOI)
// ********************************************
const  { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./helpers/ExpressError');

module.exports.validateCampground = (req,res,next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',') // error.details is an array, hence need to map, in this case, all errors will be joined by comma
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateReview  = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// ******************************
// AUTHENTICATION & AUTHORISATION
// ******************************
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()){ // (from passport) to see if user is logged in
        req.session.returnTo = req.originalUrl; // 'originalUrl' stores url that user is visiting before prompted to log in (in this case we put the path into session)
        req.flash('error','You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) { // only original author can make changes to his/her campgrounds
        req.flash('error','You are not the original contributor of this campground. Sorry!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error','You are not the original contributor of this review. Sorry!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}



