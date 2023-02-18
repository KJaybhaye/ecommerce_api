const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field."],
        maxLength: 100,
        minLength: 3,
    },
    price: {
        type: Number,
        required: [true, "Price is required field."],
        min: 0,
    },
    description :{
        type: String,
        // required: [true, "provide description"],
    },
    comments: {
        type: Array
    },
    ratings: {
        type: Array
    }
}, {timestamps: true})


module.exports = mongoose.model("Product", productSchema);