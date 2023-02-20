const express = require("express");

// routes 
const authRoute = require("./routes/auth");
const prodRoute = require("./routes/products");
const orderRoute = require("./routes/orders");
const accountRoute = require("./routes/account");
const imageRoute = require("./routes/images.js");

//middlwares
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/auth");

//security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");


// utils
require('express-async-errors');
const connectDB = require("./db/connect");
require("dotenv").config();


const PORT = process.env.PORT || 5000;
const app = express();

//security
app.set("trust proxy", 1)
app.use( rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// app use
app.use(express.json());
app.use(express.urlencoded({extended:false}))
//security app use cors, helmet, limiter

app.get("/", (req, res) =>{
    res.send("<h1>Welcome!<!h1>");
})

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", authMiddleware, prodRoute);
app.use("/api/v1/orders", authMiddleware, orderRoute);
app.use("/api/v1/account", authMiddleware, accountRoute);
app.use("/api/v1/images", imageRoute)
// app.use("/api/v1/");

// error handler and not found middlwares
app.use(notFound);
app.use(errorHandler);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_STRING);
        app.listen(PORT, () => {
            console.log(`listning at ${PORT}`);
        })
        
    } catch (error) {
        console.log(error);
    }
}

start();