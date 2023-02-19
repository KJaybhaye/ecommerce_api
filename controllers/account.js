const mongoose = require("mongoose");
const User = require("../models/user");
const StatusCodes = require("http-status-codes");


const addToCart = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const {id: productId} = req.params;
    try {
        const cart = await User.findByIdAndUpdate({_id: userId}, {$push: { cart: {id: productId}}} , {new:true, runValidators: true});
        res.status(StatusCodes.CREATED).json({msg: "added to cart successfully."});
    } catch (error) {
        next(error);
    }
}

const deleteFromCart =  async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const {id: productId} = req.params;
    try {
        const product = await User.updateOne({_id: userId}, {$pull: { cart: {id: productId}}});
        res.status(StatusCodes.OK).json({msg: "deleted from cart successfully."});
    } catch (error) {
        next(error);
    }
}


const addToWish = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const {id: productId} = req.params;
    try {
        const wish = await User.findByIdAndUpdate({_id: userId}, {$push: { wishlist: {id: productId}}} , {new:true, runValidators: true});
        res.status(StatusCodes.CREATED).json({msg: "added to wishlist successfully."});
    } catch (error) {
        next(error);
    }
}

const deleteFromWish = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const {id: productId} = req.params;
    try {
        const product = await User.updateOne({_id: userId}, {$pull: { wishlist: {id: productId}}});
        res.status(StatusCodes.OK).json({msg: "deleted from wishlist successfully."});
    } catch (error) {
        next(error);
    }
}

module.exports = {addToCart, addToWish, deleteFromCart, deleteFromWish};