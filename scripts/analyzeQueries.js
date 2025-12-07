// scripts/analyzeQueries.js
// Analyze slow queries and provide index recommendations

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function analyzeQueries() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    const db = client.db();

    console.log('🔍 QUERY PERFORMANCE ANALYSIS');
    console.log('='.repeat(60));

    // Test common queries and measure performance
    const tests = [
      {
        name: 'Find user by email',
        collection: 'users',
        query: { email: 'test@example.com' },
        expectedIndex: 'email_unique'
      },
      {
        name: 'Find user by username',
        collection: 'users',
        query: { username: 'testuser' },
        expectedIndex: 'username_unique'
      },
      {
        name: 'Find stories by author (sorted)',
        collection: 'stories',
        query: { author: 'someAuthorId' },
        sort: { createdAt: -1 },
        expectedIndex: 'author_createdAt'
      },
      {
        name: 'Find stories by genre (sorted)',
        collection: 'stories',
        query: { genres: 'Fantasy' },
        sort: { createdAt: -1 },
        expectedIndex: 'genres_createdAt'
      },
      {
        name: 'Find trending stories',
        collection: 'stories',
        query: {},
        sort: { likes: -1, createdAt: -1 },
        expectedIndex: 'likes_createdAt_trending'
      },
      {
        name: 'Find editor picks',
        collection: 'stories',
        query: { editorPick: true },
        sort: { createdAt: -1 },
        expectedIndex: 'editorPick_createdAt'
      },
      {
        name: 'Find quick reads',
        collection: 'stories',
        query: { readTime: { $lte: 5 } },
        expectedIndex: 'readTime_asc'
      },
      {
        name: 'Find comments for story',
        collection: 'comments',
        query: { story: 'someStoryId' },
        sort: { createdAt: -1 },
        expectedIndex: 'story_createdAt'
      },
      {
        name: 'Text search stories',
        collection: 'stories',
        query: { $text: { $search: 'fantasy adventure' } },
        expectedIndex: 'text_search'
      }
    ];

    for (const test of tests) {
      console.log(`\n📊 ${test.name}`);
      console.log('-'.repeat(60));

      try {
        const collection = db.collection(test.collection);
        
        // Check if collection exists
        const collections = await db.listCollections({ name: test.collection }).toArray();
        if (collections.length === 0) {
          console.log('⚠️  Collection does not exist yet');
          continue;
        }

        // Explain query
        let explainQuery = collection.find(test.query);
        if (test.sort) {
          explainQuery = explainQuery.sort(test.sort);
        }
        
        const explanation = await explainQuery.explain('executionStats');
        
        const executionStats = explanation.executionStats;
        const winningPlan = explanation.queryPlanner.winningPlan;
        
        // Extract index used
        let indexUsed = 'NONE (Collection Scan)';
        if (winningPlan.inputStage?.indexName) {
          indexUsed = winningPlan.inputStage.indexName;
        } else if (winningPlan.stage === 'TEXT') {
          indexUsed = 'text_search';
        }
        
        const docsExamined = executionStats.totalDocsExamined;
        const docsReturned = executionStats.nReturned;
        const executionTime = executionStats.executionTimeMillis;
        
        console.log(`Query: ${JSON.stringify(test.query)}`);
        if (test.sort) {
          console.log(`Sort: ${JSON.stringify(test.sort)}`);
        }
        console.log(`Expected Index: ${test.expectedIndex}`);
        console.log(`Actual Index: ${indexUsed}`);
        console.log(`Execution Time: ${executionTime}ms`);
        console.log(`Documents Examined: ${docsExamined}`);
        console.log(`Documents Returned: ${docsReturned}`);
        
        // Performance assessment
        if (indexUsed === 'NONE (Collection Scan)') {
          console.log('❌ WARNING: No index used! Create index: ' + test.expectedIndex);
        } else if (indexUsed !== test.expectedIndex) {
          console.log('⚠️  Different index used than expected');
        } else {
          console.log('✅ Correct index used');
        }
        
        // Efficiency check
        const efficiency = docsExamined > 0 ? (docsReturned / docsExamined) * 100 : 100;
        console.log(`Efficiency: ${efficiency.toFixed(1)}%`);
        
        if (efficiency < 50) {
          console.log('⚠️  Low efficiency - consider optimizing index');
        } else if (efficiency < 100) {
          console.log('⚡ Moderate efficiency');
        } else {
          console.log('✅ Excellent efficiency');
        }

      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('💡 RECOMMENDATIONS');
    console.log('='.repeat(60));
    console.log('1. Queries with "Collection Scan" need indexes');
    console.log('2. Efficiency <50% indicates index may need optimization');
    console.log('3. Run "node scripts/createIndexes.js" to create missing indexes');
    console.log('4. Monitor query performance regularly');

  } catch (error) {
    console.error('\n❌ Error analyzing queries:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
analyzeQueries();
