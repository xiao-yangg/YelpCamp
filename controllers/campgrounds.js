const Campground = require('../models/campground');

// *********************
// MAIN CAMPGROUNDS PAGE
// *********************
module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds }); // send 'campgrounds' to cilent side to be displayed by ejs
}

// ********
// <CREATE> 
// ********
module.exports.new = (req,res) => { // get is for viewing something, without changing it eg. getting search page data
    res.render('campgrounds/new'); // page to create new entries
}

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
module.exports.create = async (req,res) => { // post is for changing something eg. forms for changing password
    const campground = new Campground(req.body.campground); // package new campground input as 'Campground' model

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map( f => ({ url: f.path, filename: f.filename })); // map passed-array into objects
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`); // redirect to the NEW campground page
}

// **************************
// SHOW INDIVIDUAL CAMPGROUND
// **************************
module.exports.show = async (req,res) => { // when an id is passed
    const campground = await Campground.findById(req.params.id).populate({ // find id and populate reviews + author, thereafter store as 'campground' 
        path:'reviews',
        populate: {
            path: 'author' // grouping reviews with its writer
        }
    }).populate('author'); // campground author

    if (!campground) {
        req.flash('error', 'Campground has been removed.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

// ********
// <UPDATE> 
// ********
module.exports.edit = async (req,res) => { // fake 'PUT' or 'PATCH' request in express
    const campground = await Campground.findById(req.params.id); // find id and store as 'campground'
    if (!campground) {
        req.flash('error', 'Campground has been removed.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });   
}

const { cloudinary } = require('../cloudinary');
module.exports.update = async(req,res) => { // 'validateCampgound' is middleware
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    
    const imgs = req.files.map( f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs); // spread and add to the array

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename); // delete filename in cloudinary as well
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}}) // pull out from campground image array the images that have the same filenames found in deleteImages array (which contains filenames)
    }
    await campground.save();
    req.flash('success', 'Updated your campground successfully!');
    res.redirect(`/campgrounds/${campground._id}`); // redirect to EDITED campground page (same path as making new campground)
}

// ********
// <DELETE> 
// ********
module.exports.delete = async(req,res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground removed successfully!');
    res.redirect('/campgrounds');
}