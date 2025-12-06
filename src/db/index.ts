import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/kentozavriki";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI, {});
        console.log("MongoDB connected!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};
