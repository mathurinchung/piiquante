const mongoose = require('mongoose');

connectDB();

async function connectDB() {
  const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true };

  try {
    await mongoose.connect(process.env.MONGO_URI, mongooseOptions);

    console.log("Successfully connected to database");
  } catch (error) {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  }
};
