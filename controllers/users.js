const User = require("../models/user");


module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
  }

  module.exports.signUp=async (req, res) => {
    try {
      //  create new user
      let { username, email, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      let registerdUser = await User.register(newUser, password);
      console.log(registerdUser);
      req.login(registerdUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", "Welcome to UrbanHavens");
        return res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm=(req, res) => {
    res.render("users//login.ejs");
  }

  module.exports.login= async (req, res) => {
    req.flash("success", "Welcome Back to UrbanHavens");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logout=(req, res, next) => {
    req.logOut((err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "You are logged out");
      return res.redirect("/listings");
    });
  }