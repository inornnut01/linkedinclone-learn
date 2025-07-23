import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${response.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
