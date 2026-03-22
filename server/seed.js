const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');

dotenv.config();

const students = [
    { name: "Nguyễn Trung Cường", mssv: "123000991", khoa: "Khoa Công nghệ Thông tin", lop: "21DTHA1", ngaySinh: "24/06/2003", avgPoint: 3.95, trainingPoint: 95 },
    { name: "Nguyễn Hậu", mssv: "123000111", khoa: "Khoa Công nghệ Thông tin", lop: "21DTHA1", ngaySinh: "15/08/2003", avgPoint: 3.85, trainingPoint: 92 },
    { name: "Phú Trần", mssv: "123000194", khoa: "Khoa Quản trị Kinh doanh", lop: "21QT1", ngaySinh: "10/05/2003", avgPoint: 3.70, trainingPoint: 88 },
    { name: "Lê Văn A", mssv: "123000001", khoa: "Khoa Công nghệ Thông tin", lop: "21DTHA2", ngaySinh: "01/01/2003", avgPoint: 3.65, trainingPoint: 85 },
    { name: "Trần Thị B", mssv: "123000002", khoa: "Khoa Quản trị Kinh doanh", lop: "21QT2", ngaySinh: "02/02/2003", avgPoint: 3.55, trainingPoint: 80 }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        await User.deleteMany();
        await Student.deleteMany();

        await Student.insertMany(students);
        
        // Create 1 test user (password: 123456)
        await User.create({
            name: "Admin Tester",
            mssv: "123000991",
            password: "password123",
            isAdmin: true
        });

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
