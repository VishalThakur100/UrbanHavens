if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// console.log(process.env.SECRET)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/reviews");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./routes/user");
const MongoStore = require("connect-mongo");

app.use(cookieParser("secretcode"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => console.log("Connected to UrbanHavens"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error is mongosession store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: false, // Set to false for local testing
    // path: '/', // Ensure the path is set correctly
    // sameSite: 'Lax',
  },
};

// app.get("/signedcookie", (req, res) => {
//   res.cookie("color", "red", { signed: true });
//   res.send("signed cookie is sent");
// });

// app.get("/verify", (req, res) => {
//   console.log(req.cookies);
//   console.log(req.signedCookies);
// });

// app.get("/", (req, res) => {
//   // console.dir(req.cookies);
//   res.send("Hello World!");
// });
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //   this is a middleware that initialize the passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demoUser",async (req,res)=>{
//   let fakeUser=new User({
//     email:"abc@gmail.com",
//     username:"@abc"
//   });
//   let registerdUser=await User.register(fakeUser,"@abc");   //it is method to register a new use instance with a given password   and it   automatically check the username is unique
//   res.send(registerdUser);
//   // passport.authenticate("local")(req, res, () => {
//   //   req.flash("success", "You are now logged in!");
//   //   res.redirect("/");
//   // });
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.get("/greetcookie", (req, res) => {
//   let { name = "anonymous" } = req.cookies;
//   res.send(`hi ${name}`);
// });

// app.get("/getcookies", (req, res) => {
//   res.cookie("greet", "namaste");
//   res.cookie("madeIn", "India");
//   res.send("cookies send");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404)); //    this is for all routes that doesn't exist     and this is my custom error made withe the class ExpressError
  res.redirect("/listings");
});

//    error handling middleware
app.use((err, req, res, next) => {
  // res.send("Something went wrong");

  let { message = "Something went wrong", statusCode = 500 } = err;
  res.status(statusCode).render("error", { message });
  // res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// app.get("/listings", async (req, res) => {
//   const sampleListing = new Listing({
//     title: "This is a Villa in the hills",
//     description: "This is a villa in the hills",
//     price: 1000000,
//     image:"",
//     location: "Mumbai",
//     country: "India",
//   });
//   await sampleListing
//     .save()
//     .then((listing) => {
//       res.send(listing);
//     })
//     .catch((err) => {
//       res.send(err);
//     });
//     console.log("succesfully saved");
// });
