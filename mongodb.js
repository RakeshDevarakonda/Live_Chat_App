import mongoose from "mongoose";




export const mongoosedatabse = async () => {
  try {
    await mongoose.connect("mongodb+srv://rakeshdevarakonda:atFOcSlAMeidjYgX@cluster0.2efebhs.mongodb.net/");
    console.log('Connected to database');
  } catch (error) {
    console.error(error);
  }
};