const User = require("../models/user");
const {StatusCodes} = require("http-status-codes");
const {BadRequest, AuthError} = require("../errors");

const register = async (req, res, next) => {
    // const {name, email, password} = req.body;
    // if(!name || !email || !password){
    //     throw new BadRequest("provid all values (name, email, password");
    // }
    if(req.body.userType === "admin"){
        if(!req.body.adminPassword || req.body.adminPassword != process.env.ADMIN_PASSWOWRD){
            const err = new BadRequest("Adming Password is wrong.")
            return next(err);
        }
    }
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
        const err = new BadRequest("Provid all values (email, password");
        return next(err);
    }
    const user = await User.findOne({email: email});
    if(!user){
        const err = new AuthError("Invalid credentails");
        return next(err);
    }
    const correct = user.comparePass(password);
    if(!correct){
        const err = new AuthError("Invalid credentails");
        return next(err);
    }
    res.status(200).json({user: {name: user.getName()}, token:user.getJWT()});
}



module.exports = {login, register}