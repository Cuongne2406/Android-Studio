const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');

dotenv.config();

const baseTasks = [
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

const seedTasksBulk = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Bulk Seeding...');

        const user = await User.findOne({ mssv: "123000991" });
        if (!user) {
            console.error('User not found.');
            process.exit(1);
        }

        // Cleanup old tasks for this user
        await Task.deleteMany({ user: user._id });
        console.log('Old tasks cleared.');

        const tasksToInsert = [];
        
        // Generate 5 tasks for each of the next 7 days
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const date = new Date();
            date.setDate(date.getDate() + dayOffset);
            const dateString = date.toDateString();

            for (let i = 0; i < 5; i++) {
                const taskIndex = (dayOffset * 5 + i) % baseTasks.length;
                tasksToInsert.push({
                    user: user._id,
                    title: baseTasks[taskIndex],
                    date: dateString,
                    time: `${8 + (i * 2)}:30`, // Spaced out times: 08:30, 10:30, 12:30, 14:30, 16:30
                    completed: Math.random() > 0.8
                });
            }
        }

        await Task.insertMany(tasksToInsert);
        console.log(`Successfully seeded ${tasksToInsert.length} tasks (5 per day for 7 days).`);
        process.exit();
    } catch (error) {
        console.error('Error seeding tasks:', error);
        process.exit(1);
    }
};

seedTasksBulk();
