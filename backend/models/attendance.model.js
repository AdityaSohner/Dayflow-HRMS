const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date:{
        type: Date,
        default: Date.now,
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date
    },
    workingHours: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        default: 'Present',
        required: true
    },
},{ 
    timestamps: true
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
