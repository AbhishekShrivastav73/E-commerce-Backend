const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,

    },
    signature: {
      type: String,

    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("payment", paymentSchema);
module.exports = Payment;
