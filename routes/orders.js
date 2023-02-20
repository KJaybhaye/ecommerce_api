const {placeOrder, updateOrder, deleteOrder, getAllOrders, getOrder} = require("../controllers/orders");
const express = require("express");

const router = express.Router();

router.route("/").get(getAllOrders);
router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);
router.route("/:pid").post(placeOrder);

module.exports = router;