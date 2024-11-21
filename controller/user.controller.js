const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BlacklistModel = require("../models/blacklist.model");
const paymentModel = require("../models/payment.model");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");

const Razorpay = require("razorpay");
const Payment = require("../models/payment.model");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All feilds are required",
      });
    }

    const isUserExists = await userModel.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "User signed in successfully",
      user: user,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  // Sirf token ko hatane se kaam nahi chlega vo ejs me kaam krega
  // React me token ko blacklist krna pdega

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    const isTokenBlacklisted = await BlacklistModel.findOne({ token });
    if (isTokenBlacklisted) {
      return res.status(400).json({
        message: "Token is already blacklisted",
      });
    }

    await BlacklistModel.create({
      token,
    });
  } catch (error) {
    next(error);
  }
};
module.exports.getProfile = async function (req, res, next) {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User fetched",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createOrder = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    const option = {
      amount: product.amount * 100,
      currency: "INR",
      receipt: product._id,
    };

    const order = await instance.orders.create(option);

    res.status(200).json({
      order,
    });

    const payment = await paymentModel.create({
      orderId: order.id,
      amount: product.amount,
      currency: "INR",
      status: "pending",
    });
  } catch (error) {
    res.send(error.message);
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const {
      validatePaymentVerification,
    } = require("../node_modules/razorpay/dist/utils/razorpay-utils.js");

    const isValid = validatePaymentVerification({orderId,paymentId},signature,secret);

    if(isValid){
        const payment = await paymentModel.findOne({
            orderId
        })

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = 'success'

        await payment.save()

        res.status(200).json({
            message : 'Payment Verified Successfully'
        })
    }else{
        const payment = await paymentModel.findOne({orderId})
        payment.status = 'failed'
        await payment.save()
        res.status(400).json({
            message : 'Payment varification failed'
        })
    }
  } catch (error) {
    res.send(error);
  }
};
