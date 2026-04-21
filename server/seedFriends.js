const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Friend = require('./models/Friend');

dotenv.config();

const friends = [
    {
        name: 'Nguyễn Văn A',
        email: 'vana@example.com',
        phone: '0901234567',
        description: 'Bạn thân từ thời đại học',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random'
    },
    {
        name: 'Trần Thị B',
        email: 'thib@example.com',
        phone: '0912345678',
        description: 'Đồng nghiệp tại công ty cũ',
        avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=random'
    },
    {
        name: 'Lê Văn C',
        email: 'vanc@example.com',
        phone: '0987654321',
        description: 'Bạn cùng lớp cao học',
        avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=random'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding Friends...');

        await Friend.deleteMany();
        console.log('Existing Friends cleared');

        await Friend.insertMany(friends);
        console.log('Friend data seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
