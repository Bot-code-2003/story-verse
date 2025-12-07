// scripts/verifyIndexes.js
// Verify and analyze MongoDB indexes for StoryVerse

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function verifyIndexes() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    const db = client.db();

    // Get database stats
    const stats = await db.stats();
    console.log('📊 DATABASE STATISTICS');
    console.log('='.repeat(60));
    console.log(`Database: ${stats.db}`);
    console.log(`Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Collections: ${stats.collections}`);
    console.log(`Indexes: ${stats.indexes}`);
    console.log('='.repeat(60));

    const collections = ['users', 'stories', 'comments', 'likes', 'saves'];
    let totalIndexSize = 0;

    for (const collectionName of collections) {
      console.log(`\n📚 ${collectionName.toUpperCase()} COLLECTION`);
      console.log('-'.repeat(60));

      try {
        const collection = db.collection(collectionName);
        
        // Get collection stats
        const collStats = await db.command({ collStats: collectionName });
        const docCount = collStats.count || 0;
        const avgDocSize = collStats.avgObjSize || 0;
        const totalSize = collStats.size || 0;
        const indexSize = collStats.totalIndexSize || 0;
        
        totalIndexSize += indexSize;

        console.log(`Documents: ${docCount.toLocaleString()}`);
        console.log(`Avg Document Size: ${(avgDocSize / 1024).toFixed(2)} KB`);
        console.log(`Total Data Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Total Index Size: ${(indexSize / 1024 / 1024).toFixed(2)} MB`);
        
        // Get indexes
        const indexes = await collection.indexes();
        console.log(`\nIndexes (${indexes.length}):`);
        
        indexes.forEach((index, i) => {
          const keys = Object.keys(index.key).map(k => {
            const direction = index.key[k] === 1 ? '↑' : index.key[k] === -1 ? '↓' : index.key[k];
            return `${k}: ${direction}`;
          }).join(', ');
          
          const unique = index.unique ? ' [UNIQUE]' : '';
          const text = index.textIndexVersion ? ' [TEXT]' : '';
          const background = index.background ? ' [BG]' : '';
          
          console.log(`  ${i + 1}. ${index.name}${unique}${text}${background}`);
          console.log(`     Keys: { ${keys} }`);
        });

      } catch (error) {
        if (error.message.includes('not found')) {
          console.log(`⚠️  Collection does not exist yet`);
        } else {
          console.log(`❌ Error: ${error.message}`);
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Index Size: ${(totalIndexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Storage Used: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB / 512 MB`);
    console.log(`Storage Available: ${(512 - stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Index Overhead: ${((totalIndexSize / stats.dataSize) * 100).toFixed(1)}%`);
    
    const storagePercent = (stats.storageSize / (512 * 1024 * 1024)) * 100;
    console.log(`\n📈 M0 Cluster Usage: ${storagePercent.toFixed(1)}%`);
    
    if (storagePercent > 80) {
      console.log('⚠️  WARNING: Storage usage is high!');
    } else if (storagePercent > 50) {
      console.log('⚡ Storage usage is moderate');
    } else {
      console.log('✅ Storage usage is healthy');
    }

    // Performance recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('='.repeat(60));
    
    if (totalIndexSize / stats.dataSize > 0.5) {
      console.log('⚠️  Index size is >50% of data size. Consider:');
      console.log('   - Reviewing rarely used indexes');
      console.log('   - Using partial indexes for large collections');
    } else {
      console.log('✅ Index size ratio is healthy');
    }
    
    if (stats.indexes < 10) {
      console.log('⚠️  Few indexes detected. Consider running createIndexes.js');
    } else {
      console.log(`✅ Good number of indexes (${stats.indexes})`);
    }

  } catch (error) {
    console.error('\n❌ Error verifying indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
verifyIndexes();
