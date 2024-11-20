// Purchase ki history rakhne k liye apne database me isslye hm ye model create kr rhe hai....

const mongoose = require("mongoose");

const orderSchemaa = mongoose.Schema(
  {
    products: {
      type: mongoose.Schema.Types.ObjectId, // Seller ka isslye nahi bnya kyu ki uski details products me aaajaegi to populate kr lenge
      ref: "product",
    },
    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user" 
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('order', orderSchemaa)
module.exports = Order;