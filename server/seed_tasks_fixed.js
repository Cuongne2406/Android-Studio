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

const seedTasksFixed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Fixed Seeding...');

        const user = await User.findOne({ mssv: "123000991" });
        if (!user) {
            console.error('User not found.');
            process.exit(1);
        }

        // Cleanup old tasks for this user
        await Task.deleteMany({ user: user._id });
        console.log('Old tasks cleared.');

        const tasksToInsert = codingTasks.map((title, index) => {
            const date = new Date();
            // Spread tasks starting from today (April 25)
            date.setDate(date.getDate() + (index % 5)); 
            
            return {
                user: user._id,
                title,
                // USE toDateString() to match frontend logic exactly
                date: date.toDateString(),
                time: `${10 + (index % 8)}:00`,
                completed: Math.random() > 0.7
            };
        });

        await Task.insertMany(tasksToInsert);
        console.log('10 Coding Tasks Re-seeded with correct Date Format!');
        process.exit();
    } catch (error) {
        console.error('Error seeding tasks:', error);
        process.exit(1);
    }
};

seedTasksFixed();
