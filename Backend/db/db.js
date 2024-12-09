const mongoose = require("mongoose");
const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (conn) {
      console.log("connected successfully");
    }
  } catch (error) {
    console.log("Problem in connecting to the database");
  }
};
module.exports = connectToDb;
