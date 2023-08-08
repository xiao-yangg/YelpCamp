// ************************************************
// THIS FILE IS USED TO RESET DATABASE (WITH SEEDS)
//             [SEEDS ARE DUMMY DATA]
// ************************************************

// *************************
// IMPORTING REVELANT THINGS
// *************************
const Campground = require('../models/campground'); // current location: 'seeds' file => back out one file and go to 'models' with '..'
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

// **********************
// CONNECTION TO MONGOOSE
// **********************
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', { // 27017 is default database in mongoose
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; // checking if mongoose is successfully connected
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
})

// *********
// MAIN BODY
// *********
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({}); // make sure everything is cleared in database
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground // replace with new seed data
        ({
            author: '60c19f2f9f58a72754e9b359',
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor et commodi beatae amet ipsam, impedit quam ipsum molestiae repudiandae, non magni porro odit placeat, eum aliquam repellendus sint error soluta!',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { 
                type:"Point", 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
            ]},
            images: [
                {
                    url: 'https://res.cloudinary.com/dzcwwadep/image/upload/v1623414770/YelpCamp/aex0rmzj4eucz4vyoit9.jpg',
                    filename: 'YelpCamp/aex0rmzj4eucz4vyoit9'
                },
                {
                    url: 'https://res.cloudinary.com/dzcwwadep/image/upload/v1623414876/YelpCamp/sgv8ii1djt2wmnjakhjt.jpg',
                    filename: 'YelpCamp/sgv8ii1djt2wmnjakhjt' 
                },
            ]
        });
        await camp.save();
    }
}

// ****************************
// CLOSING PROGRAM AFTER FINISH
// ****************************
seedDB().then(() => {
    console.log('Database closing!');
    mongoose.connection.close();
});