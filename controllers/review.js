const Review = require('../models/review.js');
const listing = require('../models/listing.js');

module.exports.postReview = async (req, res) => {
    let { id } = req.params;
    let listings = await listing.findById(id);
    let newReview = new Review(req.body.review);
     newReview.author = req.user._id;
    listings.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success","New Review created Successfully!")
    res.redirect(`/listing/${id}`);

}


module.exports.deleteReview =async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully!")
    res.redirect(`/listing/${id}`);

}
