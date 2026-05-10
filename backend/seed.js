const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Diary = require('./models/Diary');
const User = require('./models/User');

dotenv.config();

// Set DNS servers to Cloudflare to ensure reliable resolution of MongoDB Atlas SRV records
dns.setServers(['1.1.1.1', '1.0.0.1']);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const seedData = [
    {
        title: 'My First Day',
        content: 'Today was an amazing day. I started my new job and everything went smoothly.',
        mood: 'Excited'
    },
    {
        title: 'Weekend Reflections',
        content: 'Spent the weekend with family. It was relaxing and rejuvenating.',
        mood: 'Peaceful'
    },
    {
        title: 'Learning New Things',
        content: 'Started learning React today. It\'s challenging but fun!',
        mood: 'Motivated'
    },
    {
        title: 'A Tough Day',
        content: 'Had a rough day at work. Need to take some time to recharge.',
        mood: 'Tired'
    },
    {
        title: 'Grateful Moment',
        content: 'Feeling grateful for all the good things in my life. Health, family, friends.',
        mood: 'Grateful'
    }
];

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Diary.deleteMany();

        // Find the first available user to associate these diaries with
        const user = await User.findOne();

        if (!user) {
            throw new Error('No user found in the database. Please register a user before seeding diaries.');
        }

        const sampleDiaries = seedData.map(diary => {
            return { ...diary, user: user._id };
        });

        await Diary.insertMany(sampleDiaries);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();

        await Diary.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}