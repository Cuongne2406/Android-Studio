const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Garden = require('./models/Garden');
const User = require('./models/User');

dotenv.config();

const nodes = [
    {
        plantName: 'Neural Fern X-1',
        notes: 'High sync rate detected. Requires low light and bioluminescent nutrients.',
        imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=200&auto=format&fit=crop',
        waterStatus: 'Stable'
    },
    {
        plantName: 'Cyber Cactus v2',
        notes: 'Spiked armor reinforced with graphene. Minimal water required.',
        imageUrl: 'https://images.unsplash.com/photo-1519336305849-412079a4e3b2?q=80&w=200&auto=format&fit=crop',
        waterStatus: 'Stable'
    },
    {
        plantName: 'Quantum Orchid',
        notes: 'Petals shift in and out of the physical spectrum. Do not touch during phase shift.',
        imageUrl: 'https://images.unsplash.com/photo-1444492442477-1678fa30a524?q=80&w=200&auto=format&fit=crop',
        waterStatus: 'Critical'
    },
    {
        plantName: 'Neon Ivy',
        notes: 'Climbs neural pathways. Pulse frequency: 60Hz.',
        imageUrl: 'https://images.unsplash.com/photo-1509223197845-458d87318791?q=80&w=200&auto=format&fit=crop',
        waterStatus: 'Stable'
    }
];

const seedNodes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const admin = await User.findOne({ email: 'admin@zenith.ai' });
        if (!admin) {
            console.log('Admin user not found. Run createAdmin.js first.');
            process.exit(1);
        }

        const nodesWithUser = nodes.map(node => ({ ...node, userId: admin._id }));
        
        await Garden.deleteMany({ userId: admin._id });
        await Garden.insertMany(nodesWithUser);

        console.log('Neural Hub seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding nodes:', error);
        process.exit(1);
    }
};

seedNodes();
