const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name: { type: String, required: true },
    mssv: { type: String, required: true, unique: true },
    khoa: { type: String, required: true },
    lop: { type: String, required: true },
    ngaySinh: { type: String, required: true },
    avgPoint: { type: Number, required: true, default: 0 },
    trainingPoint: { type: Number, required: true, default: 0 },
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
