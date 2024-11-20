const express = require("express");
const { createProduct, getAllPost, getProductById } = require("../controller/product.controller");
const { isAuthenticated, isSeller } = require("../middlewares/auth.middleware");
const router = express.Router();
const upload = require("../config/multer");

// router.use(isAuthenticated).use(isSeller); // Universally apply middleware

router.post(
  "/create",
  isAuthenticated,
  isSeller,
  upload.single("images"),
  createProduct
);
router.get("/", getAllPost);
router.get("/:id", getProductById);

module.exports = router;
