import mongoose from "mongoose";

 const connectDB = async ()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/SDE_Intern_Assignment");
        console.log("MongoDB connected successfully");
      } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
      }
}
export default connectDB;
