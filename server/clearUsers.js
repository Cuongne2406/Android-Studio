const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        await User.deleteMany({});
        console.log('Users Cleared');
        process.exit();
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
