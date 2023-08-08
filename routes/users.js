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

// *******
// OVERALL
// *******
router.route('/register')
    .get(users.register)
    .post(catchAsync(users.registerOK))

const passport = require('passport')
router.route('/login')
    .get(users.login)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginSuccess)

router.get('/logout', users.logout)



module.exports = router;