const Employee = require('../models/Employee.model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


const getAllEmployees = async (req, res) => {
    return res.json({
        success: true,
        count: await Employee.countDocuments(),
        data: await Employee.find()
    });
}

const  getEmployeeById = async (req, res) => {

    const id = req.params.id;
    const employee = await Employee.findById(id);
    if(!employee){
        return res.status(404).json({
            success: false,
            message:'Employee not found'
        });
    }
    return res.json({
        success: true,
        data: employee
    });
}

const createEmployee = async (req, res) => {
    try{

        const hash = await bcrypt.hash(req.body.password, 10);
        const employeeData={
            ...req.body,
            password: hash
        }
        const employee = await Employee.create(employeeData);

        return res.status(201).json({
            success: true,
            message:'Employee created successfully',
            data: employee
        });

    }catch(err){
        console.error(err);
        return res.status(400).json({
            success: false,
            message:  err.message
        });
    }
}


const updateEmployee =  async (req, res) => {
    const id = req.params.id;
    
    const employee = await Employee.findByIdAndUpdate(id, req.body, {new: true});
    if(!employee){
        return res.status(404).json({
            success: false,
            message:'Employee not found'
        });
    }
    return res.json({
        success: true,
        data: employee
    });
}

const deleteEmployee = async (req, res) => {
    const id = req.params.id;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if(!deletedEmployee){
        return res.status(404).json({
            success: false,
            message:'Employee not found'
        });
    }
    return res.json({
        success: true,
        message:'Employee deleted successfully'
    });
}


module.exports ={
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
}