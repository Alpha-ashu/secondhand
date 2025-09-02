import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Product from '../models/Product';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/secondhand-marketplace';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        username: 'TechTrader_Mumbai',
        email: 'techtrader@example.com',
        password: 'password123',
        firstName: 'Raj',
        lastName: 'Patel',
        phone: '+91-9876543210',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        isVerified: true,
        rating: { average: 4.5, count: 25 }
      },
      {
        username: 'LaptopHub_Delhi',
        email: 'laptophub@example.com',
        password: 'password123',
        firstName: 'Priya',
        lastName: 'Sharma',
        phone: '+91-9876543211',
        location: {
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India'
        },
        isVerified: true,
        rating: { average: 4.7, count: 18 }
      },
      {
        username: 'GameZone_Bangalore',
        email: 'gamezone@example.com',
        password: 'password123',
        firstName: 'Arjun',
        lastName: 'Kumar',
        phone: '+91-9876543212',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        isVerified: true,
        rating: { average: 4.3, count: 12 }
      },
      {
        username: 'PNB_Authorized_Dealer',
        email: 'pnbdealer@example.com',
        password: 'password123',
        firstName: 'Suresh',
        lastName: 'Gupta',
        phone: '+91-9876543213',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        isVerified: true,
        rating: { average: 4.9, count: 45 }
      },
      {
        username: 'SneakerVault_Mumbai',
        email: 'sneakervault@example.com',
        password: 'password123',
        firstName: 'Vikram',
        lastName: 'Singh',
        phone: '+91-9876543214',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        isVerified: true,
        rating: { average: 4.6, count: 8 }
      }
    ]);

    console.log('Created sample users');

    // Create sample products
    const products = await Product.create([
      {
        name: 'iPhone 13 Pro',
        description: 'Mint condition iPhone 13 Pro with original box, charger, and screen protector. Battery health: 89%. No scratches or dents.',
        price: 649,
        priceValue: 649,
        category: 'electronics',
        condition: 'Excellent',
        seller: users[0]._id,
        images: [
          'https://images.unsplash.com/photo-1636589343867-f1d643baf04c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VkJTIwc21hcnRwaG9uZSUyMGVsZWN0cm9uaWNzfGVufDF8fHx8MTc1NjU4MTU0N3ww&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        specifications: ['128GB Storage', '6.1-inch Display', 'Triple Camera', 'Face ID'],
        warranty: '6 months seller warranty',
        brand: 'Apple',
        model: 'iPhone 13 Pro'
      },
      {
        name: 'MacBook Air M1',
        description: '2020 MacBook Air with M1 chip. Excellent performance for work and creativity. Minor wear on palm rest.',
        price: 799,
        priceValue: 799,
        category: 'electronics',
        condition: 'Very Good',
        seller: users[1]._id,
        images: [
          'https://images.unsplash.com/photo-1632976032753-2b209dd0a921?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbGFwdG9wJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzU2NTgxNTU3fDA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        location: {
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India'
        },
        specifications: ['Apple M1 Chip', '8GB RAM', '256GB SSD', '13.3-inch Display'],
        warranty: '3 months seller warranty',
        brand: 'Apple',
        model: 'MacBook Air'
      },
      {
        name: '22K Gold Coins (10g)',
        description: 'Authentic 22K gold coins with RBI certification. Perfect for emergency funds or investment. Immediate cash available.',
        price: 58500,
        priceValue: 58500,
        category: 'precious_metals',
        seller: users[3]._id,
        images: [
          'https://images.unsplash.com/photo-1633785584922-503ad0e982f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMGNvaW5zfGVufDF8fHx8MTc1NjU4MTU1MHww&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        specifications: ['999.9 Purity', 'Hallmarked', 'BIS Certified', 'Instant Verification'],
        purity: '22 Karat',
        certification: 'RBI Verified',
        emergencyFund: true,
        processingTime: 'Same day cash'
      },
      {
        name: 'Air Jordan 1 Retro High OG',
        description: 'Rare Air Jordan 1 in original box, never worn. Size 9 US. Authenticated by StockX. Perfect collector\'s item.',
        price: 25000,
        priceValue: 25000,
        category: 'collectibles',
        condition: 'Deadstock',
        seller: users[4]._id,
        images: [
          'https://images.unsplash.com/photo-1587855049254-351f4e55fe2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWtlJTIwc25lYWtlcnMlMjBjb2xsZWN0aWJsZXxlbnwxfHx8fDE3NTY1ODE1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ],
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        specifications: ['Size 9 US', 'Never Worn', 'Original Box', 'StockX Authenticated'],
        rarity: 'Limited Edition',
        isAuction: true,
        startingBid: 15000,
        currentBid: 25000,
        bidCount: 12,
        auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
      }
    ]);

    console.log('Created sample products');
    console.log('Seed data created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
