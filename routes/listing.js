const express = require('express');
const router = express.Router();
const listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


const { isLoggedIn, isOwnre } = require('../middlewarw.js')

const listingController = require("../controllers/listing.js");

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('image'), wrapAsync(listingController.createListing));


//NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);




router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isOwnre,
        isLoggedIn,
        upload.single('image'),
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwnre, wrapAsync(listingController.deleteListing))


//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwnre, wrapAsync(listingController.editListing));


module.exports = router;