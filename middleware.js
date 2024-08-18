const { listingSchema, reviewSchema } = require("./schema");
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in First");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//    listing validation
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};

//    review validation
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  next();
};

//   review Owner
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  console.log(id);
  console.log(reviewId);
  let review = await Review.findById(reviewId);
  // if (!review) { // Check if review exists
  //   req.flash("error", "Review not found");
  //   return res.redirect(`/listings/${id}`); // Redirect to listing if review not found
  // }
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
