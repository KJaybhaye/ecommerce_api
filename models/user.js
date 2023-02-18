const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//cart and orders

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field."],
        maxLength: 20,
        minLength: 3,
    },
    userType: {
        type: String,
        enum: ["customer", "seller"],
        default: "customer"
    },
    email: {
        type: String,
        required: [true, "Email is required field."],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 5
    }
}, {timestamps: true})

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
},{timestamp: true})

userSchema.methods.getName = function(){
    return this.name;
}

userSchema.methods.getJWT = function(){
    return jwt.sign({userId: this._id, name: this.name, userId: this.userType}, process.env.SECRET_KEY, {expiresIn: process.env.TOKEN_LIFE})
}

userSchema.methods.comparePass = async function(pass){
    const correct = await bcrypt.compare(pass, this.password);
    return correct;
}
module.exports = mongoose.model("User", userSchema);