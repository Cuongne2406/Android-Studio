const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');

dotenv.config();

const codingTasks = [
    "Học React Native: Props và State",
    "Làm bài tập Lab 10 - Android Studio",
    "Nghiên cứu kiến trúc Redux Toolkit",
    "Debug lỗi JWT Invalid Signature",
    "Thiết kế giao diện Login UI",
    "Học cách sử dụng Axios Interceptors",
    "Tối ưu hóa hiệu năng FlatList",
    "Tìm hiểu về MongoDB Aggregation",
    "Viết Unit Test cho AuthMiddleware",
    "Tích hợp Google Gemini API vào Server"
];

const seedTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding Tasks...');

        const user = await User.findOne({ mssv: "123000991" });
        if (!user) {
            console.error('User not found. Please run seed.js first.');
            process.exit(1);
        }

        const tasksToInsert = codingTasks.map((title, index) => {
            const date = new Date();
            date.setDate(date.getDate() + (index % 5)); // Spread over next 5 days
            
            return {
                user: user._id,
                title,
                date: date.toISOString().split('T')[0],
                time: `${10 + (index % 8)}:00`,
                completed: Math.random() > 0.7
            };
        });

        await Task.insertMany(tasksToInsert);
        console.log('10 Coding Tasks Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding tasks:', error);
        process.exit(1);
    }
};

seedTasks();
