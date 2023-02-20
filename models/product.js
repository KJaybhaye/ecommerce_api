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
    sellerId : {
        type: String,
        required: [true, "Selller id is required."]
    },
    description :{
        type: String,
        // required: [true, "provide description"],
    },
    photos : {
        type: Array
    },
    reviews: {
        type: Array
    }
}, {timestamps: true})


module.exports = mongoose.model("Product", productSchema);