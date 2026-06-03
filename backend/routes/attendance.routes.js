const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance.model');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const attendanceController = require('../controllers/attendance.controller');


router.post('/check-in',authMiddleware, attendanceController.checkIn);
router.post('/check-out',authMiddleware, attendanceController.checkOut);
router.get('/me',authMiddleware, attendanceController.getMyAttendance);
router.get('/me/today',authMiddleware, attendanceController.getTodayAttendance);
router.get('/today',authMiddleware, roleMiddleware('admin','hr','manager'), attendanceController.getPresentEmployees);
router.get('/employee/:employeeId',authMiddleware, roleMiddleware('admin','hr','manager'), attendanceController.employeeAttendanceSummary);
router.get('/stats',authMiddleware, roleMiddleware('admin','hr','manager'), attendanceController.getAttendanceStats);


module.exports = router;