const {create, getAll, getOne, update, deleteProduct, addReview, deleteReview, updateReview} = require("../controllers/products");
const express = require("express");

const router = express.Router();

router.route("/").get(getAll).post(create);
router.route("/:id").get(getOne).patch(update).delete(deleteProduct);
router.route("/:id/review").post(addReview).delete(deleteReview).patch(updateReview);

module.exports = router;