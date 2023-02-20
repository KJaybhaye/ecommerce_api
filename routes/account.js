const  express = require("express");
const {addToCart, addToWish, deleteFromCart, deleteFromWish} = require("../controllers/account");

const router = express.Router();

router.route("/wishlist/:id").post(addToWish).delete(deleteFromWish);
router.route("/cart/:id").post(addToCart).delete(deleteFromCart);
module.exports = router;