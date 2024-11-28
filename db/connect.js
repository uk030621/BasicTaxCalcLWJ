import mongoose from "mongoose";

let isConnected = false; // Tracks the connection status

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    isConnected = connection.connections[0].readyState === 1; // Ready state 1 means connected
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
