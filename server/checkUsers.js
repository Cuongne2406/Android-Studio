const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, { email: 1, name: 1 });
        if (users.length > 0) {
            console.log('Existing Users:');
            users.forEach(u => console.log(`- Email: ${u.email} (Name: ${u.name})`));
        } else {
            console.log('No users found in database.');
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
