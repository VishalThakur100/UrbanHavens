const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

main()
  .then(() => console.log("Connected to UrbanHavens"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/UrbanHavens");
}

const initDB = async () => {
  await Listing.deleteMany({});
  // console.log("Before mapping:", initdata.data); // Log before mapping
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "66bcb1d60a889640d8cac8e4",
  }));
  // console.log("After mapping:", initdata.data); // Log after mapping
  await Listing.insertMany(initdata.data);
  console.log("Data was populated");
};

initDB();
