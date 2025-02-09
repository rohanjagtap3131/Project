const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl} = require('../middlewarw.js')
const userController = require("../controllers/user.js");


router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.userSignup))


router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
    }),
    userController.userLogin);



router.get("/logout",userController.logOutUser);



module.exports = router;