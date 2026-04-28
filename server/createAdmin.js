const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@zenith.ai';
        const userExists = await User.findOne({ email });
        
        if (userExists) {
            userExists.password = 'admin123';
            await userExists.save();
            console.log('Admin password updated to: admin123');
        } else {
            await User.create({
                name: 'Zenith Admin',
                email: email,
                password: 'admin123'
            });
            console.log('Admin user created successfully!');
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
