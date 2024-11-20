const productModel = require("../models/product.model");

module.exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const product = await productModel.create({
      name,
      description,
      price,
      images: req.file.filename,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

module.exports.getAllPost = async (req, res) => {
  try {
    const products = await productModel.find().populate("seller");
    res.status(201).json(products);
  } catch (error) {
    res.send(error);
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .populate("seller");
    res.json(product);
  } catch (error) {
    res.send(error);
  }
};
