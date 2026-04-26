const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        
        const db = mongoose.connection.db;
        await db.collection('users').dropIndex('mssv_1');
        console.log('Index mssv_1 dropped successfully');
        
        process.exit();
    } catch (error) {
        console.error('Error dropping index:', error.message);
        process.exit(1);
    }
};

dropIndex();
