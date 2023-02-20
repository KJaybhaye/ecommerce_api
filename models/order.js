const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    productId: {
        type: String,
        required: [true, "product id is required"]
    },
    address : {
        type: String,
        required: [true, "address is required"]
    },
    userId : {
        type: String,
        required: [true, "user id is required"]
    },
    sellerId : {
        type: String,
        required: [true, "seller id is required"]
    },
    paymentType : {
        type: String,
        enum: ["COD", "UPI", "Card"],
        default: "COD"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "compleed"],
        default: "pending"
    },
    status : {
        type: String,
        enum: ["pending", "delivered"],
        default: "pending"
    }
}, {timestamps: true})

module.exports = mongoose.model("Order", orderSchema);