// const { json } = require("express");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const Product = require("../models/product");


const create = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    if(userType === "customer"){
        return next(new BadRequest("Customer can't create a product."));
    }
    const {name, price, description} = req.body;
    try {
        const product = await Product.create({name, price, description, sellerId:userId});
        res.status(StatusCodes.CREATED).json(product);
    } catch (error) {
        next(error);
    }
}

const getAll = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(StatusCodes.OK).json(products);
    } catch (error) {
        next(error);
    }
}

const getOne = async (req, res, next) => {
    // console.log(req.params)
    const {id: productId} = req.params;
    try {
        const product = await Product.findOne({_id: productId});
        res.status(StatusCodes.OK).json(product);
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    if(userType === "customer"){
        return next(new BadRequest("Customer can't update a product."));
    }
    const {id: productId} = req.params;
    console.log(userId);
    try {
        // const product = [];
        if(userType === "admin"){
            const product = await Product.findByIdAndUpdate({_id: productId}, {...req.body}, {new:true, runValidators: true});
            if(product.matchedCount == 0){
                return res.status(StatusCodes.NOT_FOUND).json({msg: "Product not found."})
            }
            res.status(StatusCodes.OK).json(product);
        } else{
            const product = await Product.updateOne({_id: productId, sellerId:userId}, {...req.body}, {new:true, runValidators: true});
            if(product.matchedCount == 0){
                return res.status(StatusCodes.NOT_FOUND).json({msg: "Product not found."})
            }
            res.status(StatusCodes.OK).json(product);
        }
    } catch (error) {
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    const {userType, userId} = req.user;
    if(userType === "customer"){
        return next(new BadRequest("customer can't remove a product."));
    }
    const {id: productId} = req.params;
    try {
        if(userType === "admin"){
            const product = await Product.deleteOne({_id: productId});
            if(product.deletedCount == 0){
                return res.status(StatusCodes.NOT_FOUND).json({msg: "product not found."})
            }
            res.status(StatusCodes.CREATED).json({msg: "Product deleted successfully!"});
        } else{
            const product = await Product.deleteOne({_id: productId, sellerId:userId});
            if(product.deletedCount == 0){
                return res.status(StatusCodes.NOT_FOUND).json({msg: "Product not found."})
            }
            res.status(StatusCodes.CREATED).json({msg: "Product deleted successfully!"});
        }
    } catch (error) {
        console.log(error);
        // next(error);
    }
}

const addReview = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const review = {"postedBy": userId, text: req.body.comment, rating: req.body.rating};
    const num = req.body.rating;
    const validRatings = [0, 1, 2, 3, 4, 5];
    if(! validRatings.includes(num)){
       return res.status(StatusCodes.BAD_REQUEST).json({msg: "A valid rating between 0 to 5 is required."})
    }
    const {id: productId} = req.params;
    const oldR = await Product.find({_id: productId, reviews: {postedBy: userId}});
    console.log(oldR);
    if (oldR.length!=0){
        return res.status(StatusCodes.BAD_REQUEST).json({msg: "Review already exists."})
    }
    try {
        const product = await Product.findByIdAndUpdate({_id: productId}, {$push: { reviews: review}} , {new:true, runValidators: true});
        res.status(StatusCodes.CREATED).json({msg: "Review added successfully."});
    } catch (error) {
        next(error);
    }
}


const deleteReview = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const {id: productId} = req.params;
    try {
        const review = await Product.updateOne({_id: productId}, {$pull: { reviews: {postedBy: userId}}});
        if(review.matchedCount == 0){
            return res.status(StatusCodes.NOT_FOUND).json({msg: "Review not found."})
        }
        res.status(StatusCodes.CREATED).json({msg: "Review deleted successfully."});
    } catch (error) {
        next(error);
    }
}

const updateReview = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const review = {"postedBy": userId, text: req.body.comment, rating: req.body.rating};
    const num = req.body.rating;
    const validRatings = [0, 1, 2, 3, 4, 5];
    if(! validRatings.includes(num)){
       return res.status(StatusCodes.BAD_REQUEST).json({msg: "A valid rating between 0 to 5 is required."})
    }
    const {id: productId} = req.params;
    try {
        const newReview = await Product.findByIdAndUpdate({_id: productId, reviews: {postedBy: userId}}, {$set: { reviews: review}});
        if(newReview.matchedCount == 0){
            return res.status(StatusCodes.NOT_FOUND).json({msg: "Review not found."})
        }
        res.status(StatusCodes.CREATED).json({msg: "Review updated successfully."});
    } catch (error) {
        next(error);
    }
}



module.exports = {create, getAll, getOne, update, deleteProduct, addReview, updateReview, deleteReview};