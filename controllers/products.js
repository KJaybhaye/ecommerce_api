// const { json } = require("express");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const Product = require("../models/product");


const create = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    if(userType === "customer"){
        throw new BadRequest("customer can't create a product.");
    }
    const {name, price, description} = req.body;
    try {
        const product = await Product.create({name, price, description});
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
        throw new BadRequest("customer can't create a product.");
    }
    const {id: productId} = req.params;
    try {
        const product = await Product.findByIdAndUpdate({_id: productId}, {...req.body}, {new:true, runValidators: true});
        res.status(StatusCodes.OK).json({product});
    } catch (error) {
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    const {userType} = req.user;
    if(userType === "customer"){
        throw new BadRequest("customer can't create a product.");
    }
    const {id: productId} = req.params;
    try {
        const product = await Product.deleteOne({_id: productId});
        res.status(StatusCodes.CREATED).json({msg: "deleted successfully!"});
    } catch (error) {
        next(error);
    }
}

const addComment = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const comment = {"postedBy": userName, text: req.body.comment};
    const {id: productId} = req.params;
    try {
        const product = await Product.findByIdAndUpdate({_id: productId}, {$push: { comments: comment}} , {new:true, runValidators: true});
        res.status(StatusCodes.CREATED).json({msg: "comment added successfully."});
    } catch (error) {
        next(error);
    }
}

const addRating = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const num = req.body.rating;
    const validRatings = [0, 1, 2, 3, 4, 5];
    if(! validRatings.includes(num)){
        res.status(StatusCodes.BAD_REQUEST).json({msg: "give valid number between 0 to 5."})
    }
    const rating = {"postedBy": userName, rating: req.body.rating};
    const {id: productId} = req.params;
    try {
        const product = await Product.findByIdAndUpdate({_id: productId}, {$push: { ratings: rating}} , {new:true, runValidators: true});
        res.status(StatusCodes.CREATED).json({msg: "rating added successfully."});
    } catch (error) {
        next(error);
    }
}

// update and delete comments and ratings

module.exports = {create, getAll, getOne, update, deleteProduct, addComment, addRating};