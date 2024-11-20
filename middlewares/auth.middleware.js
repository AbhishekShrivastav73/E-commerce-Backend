const Blacklist = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// ye normal users me kaaam aajaega, par jb baat  aati hai sellers ki to ek aur bnana pdega
module.exports.isAuthenticated = async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const isTokenBlacklisted = await Blacklist.findOne({ token });
    if(isTokenBlacklisted){
        return res.status(401).json({
            message : 'Unauthorized'
        })
    }

    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports.isSeller = async function (req, res, next) {
  try {
    const user = req.user;
    if (user.role !== "seller")
      res.status(401).json({ message: "Unauthorized" });
    next();
  } catch (error) {
    next(error);
  }
};
