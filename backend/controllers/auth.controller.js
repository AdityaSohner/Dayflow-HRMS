const Employee = require('../models/Employee.model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

const loginEmployee = async (req, res) => {
    try{
        const { email, password } = req.body;
        const employee = await Employee.findOne({ email }).select('+password');
        if(!employee){
            return res.status(404).json({
                success: false,
                message:'Employee with this email not found'
            });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message:'Invalid credentials'
            });
        }
        const token = jwt.sign(
            {
                id:employee.id, 
                role:employee.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );      
        const employeeObj = employee.toObject();
        delete employeeObj.password;
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            employee: employeeObj
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

const getCurrentUser = async (req, res) => {
    try{
        console.log(req.user);
        const employee = await Employee.findById(req.user.id);
        if(!employee){
            return res.status(404).json({
                success: false,
                message:'Employee not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: employee
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'err.message'
        });
    }
};


module.exports = {
    loginEmployee,
    getCurrentUser
};