const {create, getAll, getOne, update, deleteProduct, addComment, addRating} = require("../controllers/products");
const express = require("express");

const router = express.Router();

router.route("/").get(getAll).post(create);
router.route("/:id").get(getOne).patch(update).delete(deleteProduct);
router.route("/:id/add-comment").patch(addComment);
router.route("/:id/add-rating").patch(addRating);

module.exports = router;