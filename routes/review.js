const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn,isAuthor} = require('../middlewarw.js')

const reviewController = require("../controllers/review.js");

// reviews
// POST Route
router.post("/",isLoggedIn, wrapAsync(reviewController.postReview));


// DELETE ROUTE
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;