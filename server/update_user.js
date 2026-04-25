const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const updateUserName = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        const result = await User.updateOne(
            { mssv: "123000991" },
            { $set: { name: "Nguyễn Trung Cường" } }
        );

        console.log(`Updated user name. Modified count: ${result.modifiedCount}`);
        process.exit();
    } catch (error) {
        console.error('Error updating user:', error);
        process.exit(1);
    }
};

updateUserName();
