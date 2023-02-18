const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const Order = require("../models/order");

const getAllOrders = async (req, res, next) => {
    const {userId} = req.user;
    try {
        const orders = await Order.find({userId: userId});
        res.status(StatusCodes.OK).json(orders);
    } catch (error) {
        next(error);
    }
}

const getOrder = async (req, res, next) => {
    const {id: orderId} = req.params;
    const {userId} = req.user;
    try {
        const order = await Order.findOne({_id: orderId, userId: userId});
        res.status(StatusCodes.OK).json(order);
    } catch (error) {
        next(error);
    }
}

const placeOrder = async (req, res, next) => {
    const {userId, userName, userType} = req.user;
    req.body.userId = userId;
    try {
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
        const order = await Order.findByIdAndUpdate({_id: orderId}, {...req.body}, {new:true, runValidators: true});
        res.status(StatusCodes.OK).json({order});
    } catch (error) {
        next(error);
    }
}

const deleteOrder = async (req, res, next) => {
    const {userType} = req.user;
    const {id: orderId} = req.params;
    try {
        const order = await Order.deleteOne({_id: orderId});
        res.status(StatusCodes.CREATED).json({msg: "deleted successfully!"});
    } catch (error) {
        next(error);
    }
}

module.exports = {placeOrder, updateOrder, deleteOrder, getAllOrders, getOrder};