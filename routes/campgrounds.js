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

// ******
// MULTER
// ******
const multer = require('multer');
const { storage } = require('../cloudinary'); // node automatically look for index js file in folder
const upload = multer({ storage: storage }); // can add file size limit here also

// *******
// OVERALL
// *******
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image',2), validateCampground, catchAsync(campgrounds.create)) // make sure user logged in, multer middleware to upload user image, check if all fields filled

router.get('/new', isLoggedIn, campgrounds.new) // remember new campground must be created before can show something

router.route('/:id')
    .get(isLoggedIn, catchAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor, upload.array('image',1), validateCampground, catchAsync(campgrounds.update))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit))



module.exports = router;