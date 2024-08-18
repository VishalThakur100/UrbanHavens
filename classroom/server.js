const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const port = 8080;

const sessionOptions = {
  secret: "secretcode",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/", (req, res) => {
  //   res.send("this is root");
  //   res.send(`hi ,${req.session.name}`);
 
  res.render("flash", { name: req.session.name });
});

app.get("/register", (req, res) => {
  //   res.send("express session");
  let { name = "anonymous" } = req.query;
  //   console.log(req.session);
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user not registered");
  } else {
    req.flash("success", "user registered succefully");
  }
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`app is listening on port ${port} `);
});
