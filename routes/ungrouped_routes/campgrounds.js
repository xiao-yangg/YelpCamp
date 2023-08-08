const express = require('express');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// ***************
// Error Handler I
// ***************
const catchAsync = require('../helpers/catchAsync');

// *******
// Routing
// *******
const router = express.Router();

// ***********
// CONTROLLERS
// ***********
const campgrounds = require('../controllers/campgrounds');

// *********************
// MAIN CAMPGROUNDS PAGE
// *********************
router.get('/', catchAsync(campgrounds.index));

// ********
// <CREATE> 
// ********
router.get('/new', isLoggedIn, campgrounds.new);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.create));

// **************************
// SHOW INDIVIDUAL CAMPGROUND
// **************************
router.get('/:id', isLoggedIn, catchAsync(campgrounds.show));

// ********
// <UPDATE> 
// ********
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.update));

// ********
// <DELETE> 
// ********
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

module.exports = router;