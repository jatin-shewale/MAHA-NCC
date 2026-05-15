import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import CadetProfile from '../models/CadetProfile.js';
import Camp from '../models/Camp.js';
import Post from '../models/Post.js';
import { env } from '../config/env.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('Connected to DB for seeding...');

    // Clean slate: Drop database to remove old indexes
    await mongoose.connection.dropDatabase();
    console.log('Database cleared.');

    // Create ANO
    const ano = await User.create({
      name: 'Capt. Vikram Singh',
      email: 'ano@ncc.gov.in',
      password: 'password123',
      role: 'ano',
      unit: '1 Maharashtra Bn',
    });

    // Create Cadets
    const cadets = [
      { name: 'Cdt. Rahul Sharma', email: 'rahul@ncc.gov.in', enrollmentNo: 'MAH/SD/24/1001', wing: 'Army' },
      { name: 'Cdt. Anjali Patil', email: 'anjali@ncc.gov.in', enrollmentNo: 'MAH/SW/24/1002', wing: 'Army' },
      { name: 'Cdt. Rohan Deshmukh', email: 'rohan@ncc.gov.in', enrollmentNo: 'MAH/SD/24/1003', wing: 'Navy' },
    ];

    for (const c of cadets) {
      const user = await User.create({
        name: c.name,
        email: c.email,
        password: 'password123',
        role: 'cadet',
        unit: '1 Maharashtra Bn',
      });

      await CadetProfile.create({
        user: user._id,
        enrollmentNo: c.enrollmentNo,
        wing: c.wing,
        rank: 'Cadet',
      });
    }

    // Create Camps
    await Camp.create([
      {
        name: 'Combined Annual Training Camp (CATC-I)',
        type: 'CATC',
        startDate: new Date('2024-09-15'),
        endDate: new Date('2024-09-25'),
        location: 'Pune HQ',
        description: 'Mandatory annual training for B-Certificate eligibility.',
        capacity: 200,
        status: 'upcoming'
      },
      {
        name: 'Republic Day Camp (RDC) Selection',
        type: 'RDC',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-10'),
        location: 'Delhi/Mumbai',
        description: 'Selection trials for the prestigious Republic Day Parade.',
        capacity: 50,
        status: 'upcoming'
      }
    ]);

    // Create approved Posts
    const rahul = await User.findOne({ name: 'Cdt. Rahul Sharma' });
    await Post.create([
      {
        user: rahul._id,
        content: 'Extremely proud to have secured the Best Cadet award at the Inter-Unit Drill Competition! Jai Hind! 🇮🇳',
        category: 'Achievement',
        status: 'approved',
        likes: [],
        images: ['https://images.unsplash.com/photo-1590218126487-d63eb7ed6527?auto=format&fit=crop&q=80&w=800']
      }
    ]);

    console.log('Seeding completed successfully.');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
