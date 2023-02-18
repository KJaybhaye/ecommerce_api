const {placeOrder, updateOrder, deleteOrder, getAllOrders, getOrder} = require("../controllers/orders");
const express = require("express");

const router = express.Router();

router.route("/").post(placeOrder).get(getAllOrders);
router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);

module.exports = router;