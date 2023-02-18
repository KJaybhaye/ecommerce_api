// connect to db
const mongoose = require("mongoose");
// import mongoose from "mongoose";


const connectDB = (url) => {
    mongoose.set('strictQuery', false);
    return mongoose.connect(url);
}

module.exports = connectDB;