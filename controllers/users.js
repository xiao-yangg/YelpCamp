const User = require('../models/user');

// *****************
// REGISTRATION PAGE
// *****************
module.exports.register = (req,res) => {
    res.render('users/register');
}

module.exports.registerOK = async(req,res,next) => {
    try {
        const { email,username,password } = req.body;
        const user = new User({ email,username });
        const registerUser = await User.register(user, password); // this adds salt and hash and store password with email and username of new user

        req.login(registerUser, err => { // take the user and log them in after they register
            if (err) return next(err);
            req.flash('success','Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
    } 
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

// **********
// LOGIN PAGE
// **********
module.exports.login = (req,res) => {
    res.render('users/login');
}

module.exports.loginSuccess = (req,res) => {
    const { username } = req.body
    req.flash('success',`WELCOME BACK, ${username}!`);

    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; // delete the object after using it already
    res.redirect(redirectUrl);
}

// ******
// LOGOUT
// ******
module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success','Goodbye! See you soon!')
    res.redirect('/campgrounds');
}