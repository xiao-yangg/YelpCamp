const express = require('express');

const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');

// ***************
// Error Handler I
// ***************
const catchAsync = require('../helpers/catchAsync');

// *******
// Routing
// *******
const router = express.Router({ mergeParams: true }); // all params from main.js can be accessed in this js file

// ***********
// CONTROLLERS
// ***********
const reviews = require('../controllers/reviews');

// *******************************
// REVIEWS PAGE (BY CAMPGROUND ID)
// *******************************
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.submitReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;