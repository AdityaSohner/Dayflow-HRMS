const Attendance = require('../models/attendance.model');
const Employee = require('../models/Employee.model');


const checkIn = async (req, res) => {
    try{
        const employeeId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingAttendance = await Attendance.findOne({ employee: employeeId, date: today });
        if(existingAttendance){
            return res.status(400).json({
                success: false,
                message: 'Already checked in for today'
            });
        }
        const newAttendance = await Attendance.create({
            employee: employeeId,
            date: today,
            checkIn: new Date(),
            status: 'Present'
        });
        return res.status(201).json({
            success: true,
            message: 'Checked in successfully',
            data: newAttendance
        });
        
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const checkOut = async (req, res) => {
    try{
        const employeeId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendance = await Attendance.findOne({ employee: employeeId, date: today });
        if(!attendance){
            return res.status(400).json({
                success: false,
                message: 'No check-in record found for today'
            });
        }
        if(attendance.checkOut){
            return res.status(400).json({
                success: false,
                message: 'Already checked out for today'
            });
        }
        attendance.checkOut = new Date();
        const checkInTime = new Date(attendance.checkIn);
        const checkOutTime = new Date(attendance.checkOut);
        const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        attendance.workingHours = Number(workingHours.toFixed(2));
        await attendance.save();
        return res.status(200).json({
            success: true,
            message: 'Checked out successfully',
            data: attendance
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getMyAttendance = async (req, res) => {
    try{
        const employeeId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const attendanceRecords = await Attendance.find({ employee: employeeId })
                                    .sort({ date: -1 })
                                    .skip(skip)
                                    .limit(limit);

        const totalRecords = await Attendance.countDocuments({ employee: employeeId });
        return res.status(200).json({
            success: true,
            message: 'Attendance records fetched successfully',
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords,
            data: attendanceRecords
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const getTodayAttendance = async (req, res) => {
    try{
        const employeeId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendanceRecord = await Attendance.findOne({ employee: employeeId, date: today });
        if(!attendanceRecord){
            return res.status(404).json({
                success: false,
                message: 'No attendance record found for today'
            });
        }
        return res.status(200).json({
            success: true,
            data: attendanceRecord
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getPresentEmployees = async (req, res) => {
    try{
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const status = req.query.status;
        let filter = {
            date: today
        };

        if(status==='present'){
            filter.checkOut = null;
        }

        if(status==='checkedout'){
            filter.checkOut = { $ne: null };
        }
        const attendanceRecords = await Attendance.find(filter).populate('employee', 'firstName lastName department designation role');
        return res.status(200).json({
            success: true,
            count: attendanceRecords.length,
            data: attendanceRecords
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const employeeAttendanceSummary = async (req, res) => {
    try{
        const employeeId = req.params.employeeId;
        const employee = await Employee.findById(employeeId);
        if(!employee){
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        const attendanceRecords = await Attendance.find({ employee: employeeId }).sort({ date: -1 });
        const totalDaysPresent = attendanceRecords.length;
        const totalWorkingHours = attendanceRecords.reduce((acc, record) => acc + (record.workingHours || 0), 0);
        const averageWorkingHoursPerDay = totalDaysPresent ? Number(totalWorkingHours / totalDaysPresent).toFixed(2) : 0;

        return res.status(200).json({
            success: true,
            employee: {
                id: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                department: employee.department,
                designation: employee.designation,
                role: employee.role
            },
            attendanceSummary: {
                totalDaysPresent,
                totalWorkingHours: Number(totalWorkingHours.toFixed(2)),
                averageWorkingHoursPerDay: Number(averageWorkingHoursPerDay)
            }
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const getAttendanceStats = async (req, res) => {
    try{
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const totalEmployees = await Employee.countDocuments();
        const todayAttendance = await Attendance.find({ date: today });
        const presentToday = todayAttendance.length;
        const checkedOut = todayAttendance.filter(record => record.checkOut).length;
        const currentlyWorking = presentToday - checkedOut;
        const attendanceRate = totalEmployees ? Number((presentToday / totalEmployees) * 100).toFixed(2) : 0;

        return res.status(200).json({
            success: true,
            data: {
                totalEmployees,
                presentToday,
                checkedOut,
                currentlyWorking,
                attendanceRate
            }
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({  
            success: false,
            message: err.message
        });
    }

}

module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getTodayAttendance,
    getPresentEmployees,
    employeeAttendanceSummary,
    getAttendanceStats
};