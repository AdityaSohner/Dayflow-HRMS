const conn = require('../config/db');
const Employee = require('../models/Employee.model');


const getAllEmployees = async (req, res) => {
    return res.json(await Employee.find());
}

const createEmployee = async (req, res) => {
    try{
        const employee = await Employee.create(req.body);
        return res.status(201).json({
            success: true,
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

const  getEmployeeById = async (req, res) => {

    const id = req.params.id;
    const employee = await Employee.findById(id);
    if(!employee){
        return res.status(404).json({
            message:'Employee not found'
        });
    }
    return res.json(employee);
}

const updateEmployee =  async (req, res) => {
    const id = req.params.id;
    
    const employee = await Employee.findByIdAndUpdate(id, req.body, {new: true});
    if(!employee){
        return res.status(404).json({
            message:'Employee not found'
        });
    }
    return res.json(employee);
}

const deleteEmployee = async (req, res) => {
    const id = req.params.id;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if(!deletedEmployee){
        return res.status(404).json({
            message:'Employee not found'
        });
    }
    return res.json({
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