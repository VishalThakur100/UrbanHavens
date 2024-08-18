const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  // console.log("new review saved");
  req.flash("success", "New Review Created.😊!!");
  res.redirect(`/listings/${req.params.id}`);
  // res.send("new review saved successfully")
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {
    $pull: {
      reviews: reviewId,
    },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!!");
  res.redirect(`/listings/${id}`);
};
