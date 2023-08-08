const Campground = require('../models/campground');
const Review = require('../models/review');

// *******************************
// REVIEWS PAGE (BY CAMPGROUND ID)
// *******************************
module.exports.submitReview = async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;

    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review added successfully!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req,res) => { // review delete
    const { id,reviewId } = req.params; // reviewId from request parameter (ie. web link)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // pull from reviews array the review that matches the reviewId to delete it
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!')
    res.redirect(`/campgrounds/${id}`);
}

// Extra:
// db.reviews.deleteMany({}) in Git Bash to delete all reviews in database