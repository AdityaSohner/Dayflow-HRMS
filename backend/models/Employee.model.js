const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName:  {
        type: String,
        trim: true,
        required: true
    },
    lastName:   {
        type: String,
        trim: true,
        required: true
    },
    email:  {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    department:  {
        type: String,
        enum: ['Engineering','HR','Finance','Sales','Marketing','Operations','Management'],
        required: true
    },
    designation:  {
        type: String,
        required: true,
        trim: true
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'intern','part-time', 'contract'],
        required: true
    },
    joiningDate:  {
        type: Date,
        required: true
    },
    basicSalary:  {
        type: Number,
        min: 0,
        required: true
    },
    role:  {
        type: String,
         enum: ['employee', 'manager', 'hr', 'admin'],
        required: true
    },
    isActive:  {
        type: Boolean,
        default: true,
        required: true
    },
    lastLogin: {
        type: Date,
        
    }
},{
    timestamps: true
});
    

module.exports = mongoose.model('Employee', employeeSchema);