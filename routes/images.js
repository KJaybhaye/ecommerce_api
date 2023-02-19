const express = require("express");
const {getImage, uploadImage} = require("../controllers/images");
const multer = require("multer");
const authMiddleware = require("../middlewares/auth");


const router = express.Router();

const upload = multer()


router.route("/:id").get(getImage);
router.route("/upload").post(authMiddleware, upload.any(), uploadImage);


module.exports = router;