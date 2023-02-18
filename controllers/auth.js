const User = require("../models/user");
const {StatusCodes} = require("http-status-codes");
const {BadRequest, AuthError} = require("../errors");

const register = async (req, res, next) => {
    // const {name, email, password} = req.body;
    // if(!name || !email || !password){
    //     throw new BadRequest("provid all values (name, email, password");
    // }
    try {
        const newUser = await User.create({...req.body});
        res.status(200).json({user: {name: newUser.getName()}, token:newUser.getJWT()});
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    const {email, password} = req.body;
    if(!email  || !password){
        throw new BadRequest("provid all values (email, password");
    }
    const user = await User.findOne({email: email});
    if(!user){
        throw new AuthError("invalid credentails");
    }
    const correct = user.comparePass(password);
    if(!correct){
        throw new AuthError("invalid credentails");
    }
    res.status(200).json({user: {name: user.getName()}, token:user.getJWT()});
}



module.exports = {login, register}