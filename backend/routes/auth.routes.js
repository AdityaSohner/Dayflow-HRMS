const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/login', authController.loginEmployee);
router.post('/me', authMiddleware,authController.getCurrentUser);


module.exports = router;