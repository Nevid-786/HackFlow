import mongoose from "mongoose";
import seedAdmin from "./seedAdmin.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "HackFlow" // your database name here
    });
     await seedAdmin()
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;