const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {AuthError} = require("../errors");

const autherize = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(req.headers);
    if(!authHeader || ! authHeader.startsWith("Bearer ")){
        throw new AuthError("autherization error");
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = await jwt.verify(token, process.env.SECRET_KEY);
        
        req.user = {userId: payload.userId, userName:payload.name, userType: payload.userType};
    } catch (error) {
        
    }
    next();
}

module.exports = autherize;