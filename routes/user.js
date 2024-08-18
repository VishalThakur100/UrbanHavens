const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const usersController = require("../controllers/users");


//  router.route is a way to group together routes with different verbs but same paths.


router
  .route("/signup")
  .get(usersController.renderSignupForm)
  .post(wrapAsync(usersController.signUp));

router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    usersController.login
  );

router.get("/logout", usersController.logout);

module.exports = router;
