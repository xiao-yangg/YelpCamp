const express = require('express');

// ***************
// Error Handler I
// ***************
const catchAsync = require('../helpers/catchAsync');

// *******
// Routing
// *******
const router= express.Router();

// ***********
// CONTROLLERS
// ***********
const users = require('../controllers/users');

// *****************
// REGISTRATION PAGE
// *****************
router.get('/register', users.register);

router.post('/register', catchAsync(users.registerOK));

// **********
// LOGIN PAGE
// **********
const passport = require('passport');
router.get('/login', users.login);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginSuccess);

// ******
// LOGOUT
// ******
router.get('/logout', users.logout);

module.exports = router;