// ***************************************************************************************
// ====== TO START (in console) ==========================================================
// 'npm init -y' to make package.json
// 'npm i express mongoose ejs ejs-mate method-override joi express-session connect-flash'
// 'npm i express passport passport-local passport-local-mongoose'
// 'npm i multer dotenv'
// 'npm i cloudinary multer-storage-cloudinary'
// 'npm i @mapbox/mapbox-sdk'
// 'npm i express-mongo-sanitize sanitize-html helmet'
// 'npm i connect-mongo'
// ***************************************************************************************


// ======================== SETUPS =========================
// *************************
// IMPORTING REVELANT THINGS
// *************************
if (process.env.NODE_ENV !== "production") { // if in development mode 
    require('dotenv').config(); // allows for info in dotenv to be accessed in these files
}
// NOTE: development is webpage development phase, production is product webpage being up and running

const express = require('express'); // to use express
const app = express();
app.use(express.urlencoded({ extended: true })) // to be able to parse req.body

const Campground = require('./models/campground');

// **********************
// CONNECTION TO MONGOOSE
// **********************
const dbUrl =  'mongodb://localhost:27017/yelp-camp';
// process.env.DB_URL ||

const mongoose = require('mongoose');

// 'mongodb://localhost:27017/yelp-camp' --> 27017 is default database in mongoose
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection; // checking if mongoose is successfully connected
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
})

// ***************************
// TO USE EJS FILES IN 'VIEWS'
// ***************************
const path = require('path');
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

// ***********************************************
// MAKE LAYOUT/BOILERPLATE FOR EVERY PAGE WITH EJS
// ***********************************************
const ejsMate = require('ejs-mate');
app.engine('ejs',ejsMate);

// *************************************************************
// STATIC ASSETS SUCH AS FORMS, STYLESHEETS (STORED IN 'PUBLIC')
// *************************************************************
app.use(express.static(path.join(__dirname, 'public')));

// *********************
// METHOD OVERRIDE SETUP
// *********************
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// *************************************
// COOKIES, STORE USER SESSIONS IN MONGO
// *************************************
const session = require('express-session');
const MongoStore = require('connect-mongo');

const secret = process.env.SECRET || 'hahahahaha'
const sessionConfig = {
    store: MongoStore.create({ // storing session in mongo instead of memory of browswer which is not good
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60 // save again after 24hrs (in seconds) unless session data has changed
    }),
    name: 'session', // change name for cookies implanted such that hacker is not able to use the conventional 'connect.sid' name to make hacks
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { // customisation of cookies made
        httpOnly: true,
        // secure: true --> not used in localhost, but after upload server; function is that cookies are only configured over secure connections
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expiration: time now + 1 week's duration (in milliseconds)
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));

// ********
// PASSPORT
// ********
const User = require('./models/user');
const passport = require('passport');
const localStrategy = require('passport-local');
app.use(passport.initialize());
app.use(passport.session()) // app.use(session(sessionConfig)); must be before this line of code
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // tells how do we store a user in a session
passport.deserializeUser(User.deserializeUser()); // tells how do we get user out of session

// **************
// FLASH MESSAGES
// **************
const flash = require('connect-flash');
app.use(flash());
app.use((req,res,next) => { // this middleware to be declared before route handlers
    res.locals.success = req.flash('success'); // store whatever success msg and store in res.locals.success to be used by boilerplate
    res.locals.error = req.flash('error');

    res.locals.currentUser = req.user; // req.user returns user info: username, email, id (should come after passport is imported)
    next();
})

// ********************************
// SECURITY AGAINST MONGO INJECTION
// ********************************
const mongoSanitize = require('express-mongo-sanitize'); // prevent input of '$' and '.'
app.use(mongoSanitize());

// ******
// HELMET
// ******
const helmet = require('helmet');
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzcwwadep/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// ======================== MAIN BODY =========================
// ********
// HOMEPAGE
// ********
app.get('/',(req,res) => {
    res.render('home'); // send to client side: res.render => send ejs file; res.send => send variable in function
})

// ***********************
// USER REGISTRATION ROUTE    
// ***********************
const userRoutes = require('./routes/users');
app.use('/',userRoutes);

// ***********************************************************
// ACCESS CAMPGROUND ROUTE --> can only upload 1 image BIG SAD
// ***********************************************************
const campgroundRoutes = require('./routes/campgrounds');
app.use('/campgrounds', campgroundRoutes);

// ********************
// ACCESS REVIEWS ROUTE
// ********************
const reviewRoutes = require('./routes/reviews');
app.use('/campgrounds/:id/reviews', reviewRoutes);

// ***************
// Error Handler I
// ***************
const ExpressError = require('./helpers/ExpressError');
const { dangerouslyDisableDefaultSrc } = require('helmet/dist/middlewares/content-security-policy');

// ****************
// Error Handler II
// ****************
app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next) => {
    if (!err.statusCode) err.statusCode = 500; // default message
    if (!err.message) err.message = 'Oh No, Something Went Wrong';
    res.status(err.statusCode).render('error', { err });
})

// *********
// Open Port
// *********
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`PORT ${port} OPEN SESAME!`) // at server side
})