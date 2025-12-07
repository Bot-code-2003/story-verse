// scripts/createIndexes.js
// MongoDB Index Creation Script for StoryVerse
// Optimized for MongoDB M0 Free Tier (512 MB)

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function createIndexes() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    const db = client.db();

    // ==================== USERS COLLECTION ====================
    console.log('📚 Creating indexes for USERS collection...');
    const usersCollection = db.collection('users');

    // 1. Email index (UNIQUE) - For login/signup
    await usersCollection.createIndex(
      { email: 1 },
      { 
        unique: true, 
        name: 'email_unique',
        background: true 
      }
    );
    console.log('  ✅ Created: email_unique (UNIQUE)');

    // 2. Username index (UNIQUE) - For author pages
    await usersCollection.createIndex(
      { username: 1 },
      { 
        unique: true, 
        name: 'username_unique',
        background: true 
      }
    );
    console.log('  ✅ Created: username_unique (UNIQUE)');

    // 3. Created at index - For user analytics
    await usersCollection.createIndex(
      { createdAt: -1 },
      { 
        name: 'createdAt_desc',
        background: true 
      }
    );
    console.log('  ✅ Created: createdAt_desc');

    // ==================== STORIES COLLECTION ====================
    console.log('\n📚 Creating indexes for STORIES collection...');
    const storiesCollection = db.collection('stories');

    // 1. Author + CreatedAt compound index - For author pages with sorting
    await storiesCollection.createIndex(
      { author: 1, createdAt: -1 },
      { 
        name: 'author_createdAt',
        background: true 
      }
    );
    console.log('  ✅ Created: author_createdAt (COMPOUND)');

    // 2. Genres + CreatedAt compound index - For genre pages with sorting
    await storiesCollection.createIndex(
      { genres: 1, createdAt: -1 },
      { 
        name: 'genres_createdAt',
        background: true 
      }
    );
    console.log('  ✅ Created: genres_createdAt (COMPOUND)');

    // 3. Likes + CreatedAt compound index - For trending stories
    await storiesCollection.createIndex(
      { likes: -1, createdAt: -1 },
      { 
        name: 'likes_createdAt_trending',
        background: true 
      }
    );
    console.log('  ✅ Created: likes_createdAt_trending (COMPOUND)');

    // 4. EditorPick + CreatedAt compound index - For editor picks
    await storiesCollection.createIndex(
      { editorPick: 1, createdAt: -1 },
      { 
        name: 'editorPick_createdAt',
        background: true 
      }
    );
    console.log('  ✅ Created: editorPick_createdAt (COMPOUND)');

    // 5. ReadTime index - For quick reads filtering
    await storiesCollection.createIndex(
      { readTime: 1 },
      { 
        name: 'readTime_asc',
        background: true 
      }
    );
    console.log('  ✅ Created: readTime_asc');

    // 6. CreatedAt index - For latest stories
    await storiesCollection.createIndex(
      { createdAt: -1 },
      { 
        name: 'createdAt_desc',
        background: true 
      }
    );
    console.log('  ✅ Created: createdAt_desc');

    // 7. Text index - For search functionality
    await storiesCollection.createIndex(
      { title: 'text', description: 'text', content: 'text' },
      { 
        name: 'text_search',
        weights: {
          title: 10,
          description: 5,
          content: 1
        },
        background: true 
      }
    );
    console.log('  ✅ Created: text_search (TEXT INDEX)');

    // 8. Status index - For filtering published/draft stories
    await storiesCollection.createIndex(
      { status: 1, createdAt: -1 },
      { 
        name: 'status_createdAt',
        background: true 
      }
    );
    console.log('  ✅ Created: status_createdAt (COMPOUND)');

    // ==================== COMMENTS COLLECTION ====================
    console.log('\n📚 Creating indexes for COMMENTS collection...');
    const commentsCollection = db.collection('comments');

    // 1. Story + CreatedAt compound index - For story comments sorted
    await commentsCollection.createIndex(
      { story: 1, createdAt: -1 },
      { 
        name: 'story_createdAt',
        background: true 
      }
    );
    console.log('  ✅ Created: story_createdAt (COMPOUND)');

    // 2. User + CreatedAt compound index - For user's comments
    await commentsCollection.createIndex(
      { user: 1, createdAt: -1 },
      { 
        name: 'user_createdAt',
        background: true 
      }
    );
    console.log('  ✅ Created: user_createdAt (COMPOUND)');

    // 3. CreatedAt index - For latest comments
    await commentsCollection.createIndex(
      { createdAt: -1 },
      { 
        name: 'createdAt_desc',
        background: true 
      }
    );
    console.log('  ✅ Created: createdAt_desc');

    // ==================== LIKES COLLECTION ====================
    console.log('\n📚 Creating indexes for LIKES collection (if exists)...');
    const likesCollection = db.collection('likes');

    // 1. User + Story compound index (UNIQUE) - Prevent duplicate likes
    await likesCollection.createIndex(
      { user: 1, story: 1 },
      { 
        unique: true,
        name: 'user_story_unique',
        background: true 
      }
    );
    console.log('  ✅ Created: user_story_unique (UNIQUE COMPOUND)');

    // 2. Story index - For counting likes per story
    await likesCollection.createIndex(
      { story: 1 },
      { 
        name: 'story_idx',
        background: true 
      }
    );
    console.log('  ✅ Created: story_idx');

    // 3. User index - For user's liked stories
    await likesCollection.createIndex(
      { user: 1 },
      { 
        name: 'user_idx',
        background: true 
      }
    );
    console.log('  ✅ Created: user_idx');

    // ==================== SAVES COLLECTION ====================
    console.log('\n📚 Creating indexes for SAVES collection (if exists)...');
    const savesCollection = db.collection('saves');

    // 1. User + Story compound index (UNIQUE) - Prevent duplicate saves
    await savesCollection.createIndex(
      { user: 1, story: 1 },
      { 
        unique: true,
        name: 'user_story_unique',
        background: true 
      }
    );
    console.log('  ✅ Created: user_story_unique (UNIQUE COMPOUND)');

    // 2. Story index - For counting saves per story
    await savesCollection.createIndex(
      { story: 1 },
      { 
        name: 'story_idx',
        background: true 
      }
    );
    console.log('  ✅ Created: story_idx');

    // 3. User index - For user's saved stories
    await savesCollection.createIndex(
      { user: 1, createdAt: -1 },
      { 
        name: 'user_createdAt',
        background: true 
      }
    );
    console.log('  ✅ Created: user_createdAt (COMPOUND)');

    console.log('\n✨ All indexes created successfully!');
    console.log('\n📊 Run "node scripts/verifyIndexes.js" to verify indexes');

  } catch (error) {
    console.error('\n❌ Error creating indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
createIndexes();
