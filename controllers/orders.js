const { StatusCodes } = require("http-status-codes");
const { BadRequest, CustomError } = require("../errors");
const Order = require("../models/order");
const Product = require("../models/product");

const getAllOrders = async (req, res, next) => {
    try {
        if(req.user.userType === "seller"){
            const sellerId = req.user.userId;
            const orders = await Order.find({sellerId: sellerId});
            return res.status(StatusCodes.OK).json(orders);
        }else if(req.user.userType === "customer"){
            const {userId} = req.user;
            const orders = await Order.find({userId: userId});
            return res.status(StatusCodes.OK).json(orders);
        }else{
            const orders = await Order.find();
            return res.status(StatusCodes.OK).json(orders);
        }
    } catch (error) {
        next(error);
    }
}

const getOrder = async (req, res, next) => {
    const {id: orderId} = req.params;
    try {
        if(req.user.userType === "admin"){
            const order = await Order.findOne({_id: orderId});
            if(!order){
                next(new CustomError("not order with given id", 404));
            }
            return res.status(StatusCodes.OK).json(order);
        } else if(req.user.userType === "seller"){
            const sellerId = req.user.userId;
            const order = await Order.findOne({_id: orderId, sellerId: sellerId});
            if(!order){
               return next(new CustomError("not order with given id", 404));
            }
            return res.status(StatusCodes.OK).json(order);
        } else{
            const {userId} = req.user;
            const order = await Order.findOne({_id: orderId, userId: userId});
            if(!order){
                return next(new CustomError("not order with given id", 404));
            }
            return res.status(StatusCodes.OK).json(order);
        }
        
    } catch (error) {
        next(error);
    }
}

const placeOrder = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    req.body.userId = userId;
    const {pid:productId} = req.params;
    req.body.productId = productId;
    try {
        const product = await Product.findById({_id:productId});
        req.body.sellerId = product.sellerId;
        const order = await Order.create({...req.body});
        res.status(StatusCodes.CREATED).json({order});
    } catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    const {id: orderId} = req.params;
    try {
        if(req.user.userType === "admin"){
            const order = await Order.findByIdAndUpdate({_id: orderId}, {...req.body});
            if(order.matchedCount == 0){
                return next(new CustomError("not order with given id", 404));
            }
            return res.status(StatusCodes.OK).json(order);
        } else if(req.user.userType === "seller"){
            const sellerId = req.user.userId;
            const order = await Order.updateOne({_id: orderId, sellerId: sellerId}, {...req.body});
            if(order.matchedCount == 0){
               return next(new CustomError("not order with given id", 404));
            }
            return res.status(StatusCodes.OK).json(order);
        } else{
            return next(new BadRequest("User cannot update order."));
            // const {userId} = req.user;
            // const order = await Order.findByIdAndUpdate({_id: orderId, userId: userId}, {...req.body}, {new:true, runValidators: true});
            // if(order.matchedcount == 0){
            //    return next(new CustomError("not order with given id", 404));
            // }
            // return res.status(StatusCodes.OK).json(order);
        }
    } catch (error) {
        next(error);
    }
}

const deleteOrder = async (req, res, next) => {
    const {userType} = req.user;
    const {id: orderId} = req.params;
    try {
        if(userType === "admin"){
            const order = await Order.deleteOne({_id: orderId});
            if(order.deletedCount == 0){
               return next(new CustomError("not order with given id", 404));
            }
            return res.status(StatusCodes.OK).json({msg: "deleted successfully!"});
        } else if(userType === "seller"){
            const sellerId = req.user.userId;
            const order = await Order.deleteOne({_id: orderId, sellerId: sellerId});
            if(order.deletedCount == 0){
               return next(new CustomError("not order with given id", 404));
            }
            return res.status(StatusCodes.OK).json({msg: "deleted successfully!"});
        } else{
            return next(new BadRequest("User cannot delete a order."));
            // const {userId} = req.user;
            // const order = await Order.deleteOne({_id: orderId, userId: userId});
            // if(order.deletedCount == 0){
            //    return next(new CustomError("not order with given id", 404));
            // }
            // return res.status(StatusCodes.OK).json({msg: "deleted successfully!"});
        }
        
    } catch (error) {
        next(error);
    }
}

module.exports = {placeOrder, updateOrder, deleteOrder, getAllOrders, getOrder};