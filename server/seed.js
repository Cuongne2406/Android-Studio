const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plant = require('./models/Plant');

dotenv.config();

const plants = [
    {
        name: 'Trầu Bà Lá Xẻ (Monstera)',
        scientificName: 'Monstera Deliciosa',
        category: 'Trong nhà',
        price: 250000,
        description: 'Loài cây biểu tượng với những chiếc lá xẻ độc đáo, mang lại vẻ đẹp nhiệt đới và sang trọng cho không gian sống.',
        light: 'Ánh sáng gián tiếp',
        water: '1 lần/tuần',
        difficulty: 'Dễ',
        imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800'
    },
    {
        name: 'Cây Lưỡi Hổ',
        scientificName: 'Sansevieria trifasciata',
        category: 'Trong nhà',
        price: 150000,
        description: 'Khả năng lọc không khí tuyệt vời, đặc biệt là vào ban đêm. Rất bền bỉ và không cần chăm sóc nhiều.',
        light: 'Á_sáng yếu đến mạnh',
        water: '2 tuần/lần',
        difficulty: 'Rất dễ',
        imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=800'
    },
    {
        name: 'Cây Lan Ý',
        scientificName: 'Spathiphyllum',
        category: 'Trong nhà',
        price: 120000,
        description: 'Hoa trắng thanh khiết, có tác dụng loại bỏ các độc tố trong không khí như formaldehyde và benzene.',
        light: 'Bóng râm bán phần',
        water: '2-3 lần/tuần',
        difficulty: 'Trung bình',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800'
    },
    {
        name: 'Bàng Singapore',
        scientificName: 'Ficus Lyrata',
        category: 'Trong nhà',
        price: 450000,
        description: 'Lá to, bóng và đẹp mắt. Phù hợp để làm điểm nhấn ở góc phòng khách hoặc văn phòng.',
        light: 'Ánh sáng sáng gián tiếp',
        water: '1 lần/tuần',
        difficulty: 'Trung bình',
        imageUrl: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=800'
    },
    {
        name: 'Cây Nha Đam',
        scientificName: 'Aloe Vera',
        category: 'Mọng nước',
        price: 80000,
        description: 'Vừa làm cảnh vừa có tác dụng làm đẹp và sơ cứu vết bỏng. Dễ trồng và thích ánh nắng.',
        light: 'Ánh nắng trực tiếp',
        water: '2 tuần/lần',
        difficulty: 'Dễ',
        imageUrl: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800'
    },
    {
        name: 'Cây Đa Búp Đỏ',
        scientificName: 'Ficus Elastica',
        category: 'Văn phòng',
        price: 320000,
        description: 'Lá dày, màu đậm sang trọng. Giúp lọc bụi và tăng độ ẩm cho không khí.',
        light: 'Ánh sáng trung bình',
        water: '1 lần/tuần',
        difficulty: 'Dễ',
        imageUrl: 'https://images.unsplash.com/photo-1620215175664-cb803274291f?auto=format&fit=crop&w=800'
    },
    {
        name: 'Cây Trầu Bà Vàng',
        scientificName: 'Epipremnum aureum',
        category: 'Trong nhà',
        price: 50000,
        description: 'Cây leo phát triển nhanh, cực kỳ bền bỉ. Có thể trồng trong đất hoặc thủy sinh.',
        light: 'Mọi điều kiện ánh sáng',
        water: '2 lần/tuần',
        difficulty: 'Rất dễ',
        imageUrl: 'https://images.unsplash.com/photo-1637967886160-fd78dc3ce3f5?auto=format&fit=crop&w=800'
    },
    {
        name: 'Xương Rồng Mix',
        scientificName: 'Cactaceae',
        category: 'Xương rồng',
        price: 180000,
        description: 'Sự kết hợp của nhiều loại xương rồng nhỏ xinh trong một chậu gốm thủ công.',
        light: 'Nắng gắt',
        water: '1 tháng/lần',
        difficulty: 'Rất dễ',
        imageUrl: 'https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?auto=format&fit=crop&w=800'
    },
    {
        name: 'Sen Đá Thạch Ngọc',
        scientificName: 'Sedum pachyphyllum',
        category: 'Mọng nước',
        price: 65000,
        description: 'Những lá tròn mọng nước trông giống như những viên ngọc bích.',
        light: 'Nắng sáng',
        water: '10 ngày/lần',
        difficulty: 'Dễ',
        imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800'
    },
    {
        name: 'Cỏ Lan Chi',
        scientificName: 'Chlorophytum comosum',
        category: 'Trong nhà',
        price: 45000,
        description: 'Lá mảnh mai với sọc trắng xanh. Rất tốt trong việc loại bỏ khí carbon monoxide.',
        light: 'Ánh sáng gián tiếp',
        water: '2 lần/tuần',
        difficulty: 'Dễ',
        imageUrl: 'https://images.unsplash.com/photo-1601055006456-651540d5107e?auto=format&fit=crop&w=800'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
        
        await Plant.deleteMany();
        console.log('Old Plants Deleted');
        
        await Plant.insertMany(plants);
        console.log('Plants Seeded Successfully');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
