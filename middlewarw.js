const listing = require('./models/listing.js');
const ExpressError = require('./utils/ExpressError.js');
const Review = require('./models/review.js');
const { listingSehema} = require('./scama.js');

module.exports.isLoggedIn = (req,res,next) =>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing");
       return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req,res,next) =>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl
    }
    next();
};

module.exports.isOwnre = async(req, res, next) =>{
    let {id}= req.params;
    let listings = await listing.findById(id);
    if(!listings.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have axis to edit");
       return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports. validateListings = (req, res, next) => {
    let { error } = listingSehema.validate(req.body);

    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
}

module.exports. validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    } 
}

module.exports.isAuthor = async(req, res, next) =>{
    let {id,reviewId}= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have axis to delete");
       return res.redirect(`/listing/${id}`);
    }
    next();
}
