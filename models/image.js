const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    name: String,
    image: {
        data: Buffer,
        contentType: String
    }
},{timestamps: true});
module.exports = mongoose.model("Image", imageSchema);