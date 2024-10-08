const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// note :  pbkdf2 hashing algorithm is used
const userSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    // unique:true
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
