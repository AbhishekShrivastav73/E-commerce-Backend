const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/signup', userController.signup);
router.post('/login', userController.signin);
router.post('/logout', authMiddleware.isAuthenticated, userController.logout);
router.get('/profile', authMiddleware.isAuthenticated, userController.getProfile);

router.get('/order/:id',authMiddleware.isAuthenticated,userController.createOrder)
router.get('/verify/:id',authMiddleware.isAuthenticated,userController.verifyPayment)

module.exports = router;
