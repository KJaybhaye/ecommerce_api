const {StatusCodes} = require("http-status-codes");
const CustomError = require("./customError");

class AuthError extends CustomError{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = AuthError;