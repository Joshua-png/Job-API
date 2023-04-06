const mongoose = require("mongoose");

const connectDB = async (url) => {
  const connection = await mongoose.connect(url);

  console.log(`MongoDB connection: ${connection.connection.host}`);

  return connection;
};

module.exports = connectDB;
