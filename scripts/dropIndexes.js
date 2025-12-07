// scripts/dropIndexes.js
// Drop all custom indexes (keep only _id indexes)
// USE WITH CAUTION - Only run if you need to reset indexes

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Create readline interface for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function dropIndexes() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('⚠️  WARNING: This will drop all custom indexes!');
    console.log('⚠️  Only _id indexes will remain.\n');
    
    const answer = await askQuestion('Are you sure you want to continue? (yes/no): ');
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled');
      rl.close();
      return;
    }

    console.log('\n🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    const db = client.db();
    const collections = ['users', 'stories', 'comments', 'likes', 'saves'];

    for (const collectionName of collections) {
      console.log(`📚 Processing ${collectionName} collection...`);
      
      try {
        const collection = db.collection(collectionName);
        const indexes = await collection.indexes();
        
        let droppedCount = 0;
        for (const index of indexes) {
          // Don't drop the _id index
          if (index.name !== '_id_') {
            await collection.dropIndex(index.name);
            console.log(`  ✅ Dropped: ${index.name}`);
            droppedCount++;
          }
        }
        
        if (droppedCount === 0) {
          console.log(`  ℹ️  No custom indexes to drop`);
        } else {
          console.log(`  ✅ Dropped ${droppedCount} indexes`);
        }
        
      } catch (error) {
        if (error.message.includes('not found')) {
          console.log(`  ⚠️  Collection does not exist`);
        } else {
          console.log(`  ❌ Error: ${error.message}`);
        }
      }
    }

    console.log('\n✨ Index cleanup complete!');
    console.log('💡 Run "node scripts/createIndexes.js" to recreate indexes');

  } catch (error) {
    console.error('\n❌ Error dropping indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
    rl.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
dropIndexes();
