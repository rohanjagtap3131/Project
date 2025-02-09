const listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allData = await listing.find({});
    res.render("listings/index.ejs", { allData });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listings = await listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        }).populate("owner");
    if (!listings) {
        req.flash("error", "Listing you requested for dose not exits!");
        res.redirect("/listing");
    }
    console.log(listings);
    res.render("listings/show.ejs", { listings });

}


module.exports.createListing = async (req, res) => {
    let { location } = req.body
    let response = await geocodingClient.forwardGeocode({
        query: location,
        // query: "Mumbai ,India",
        limit: 1,
    })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new listing({ title, description, price, counry, location } = req.body);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing created successfully!")

    res.redirect("listing");

}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listings = await listing.findById(id);
    if (!listings) {
        req.flash("error", "Listing you requested for dose not exits!");
        res.redirect("/listing");
    }
    let orignanImageUrl = listings.image.url;
    orignanImageUrl = orignanImageUrl.replace("/uploa", "/uoload/h_300,w_250");
    res.render("listings/edit.ejs", { listings, orignanImageUrl })
}


module.exports.updateListing = async (req, res) => {

    let { id } = req.params;
    let newListing = { title, description, price, counry, location } = req.body;
    let listings = await listing.findByIdAndUpdate(id, newListing);
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listings.image = { url, filename };
        await listings.save();
    }
    req.flash("success", "Listing Updated successfully!")
    res.redirect(`/listing/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Is Deleted Successfully!")
    res.redirect("/listing");
}