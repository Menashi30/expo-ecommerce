import { mongoose } from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log(`connected to mongo db:  ${conn.connection.host}`);
  } catch (error) {
    console.error("mongo db connection failed");
    process.exit(1); // status code 1 means failure and 0 means success
  }
};
