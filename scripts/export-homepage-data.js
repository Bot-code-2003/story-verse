// Export homepage stories from MongoDB to homepage_data.js
// Run with: node scripts/export-homepage-data.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalents of __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_DEV_URI || process.env.DATABASE_URL || "mongodb://localhost:27017/short_fiction";

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  profileImage: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Story Schema
const storySchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coverImage: String,
  readTime: Number,
  genres: [String],
  likesCount: Number,
  editorPick: Boolean,
  published: Boolean,
  authorSnapshot: {
    name: String,
    username: String,
    profileImage: String,
  },
}, { timestamps: true });

const Story = mongoose.models.Story || mongoose.model("Story", storySchema);

// Helper function to format story
function formatStory(story) {
  // Try to get author from authorSnapshot first, then from populated author field
  let authorName = "Anonymous";
  
  if (story.authorSnapshot?.name) {
    authorName = story.authorSnapshot.name;
  } else if (story.authorSnapshot?.username) {
    authorName = story.authorSnapshot.username;
  } else if (story.author?.name) {
    authorName = story.author.name;
  } else if (story.author?.username) {
    authorName = story.author.username;
  } else {
    console.warn(`⚠️  Story "${story.title}" (${story._id}) has no author data`);
  }
  
  return {
    id: story._id.toString(),
    title: story.title,
    author: authorName,
    coverImage: story.coverImage || "",
    genres: story.genres || [],
    readTime: story.readTime || 0,
  };
}

// Fetch stories by query
async function fetchStories(query, sort, limit = 20) {
  try {
    const stories = await Story.find(query)
      .populate('author', 'name username') // Populate author data
      .sort(sort)
      .limit(limit)
      .lean();
    
    return stories.map(formatStory);
  } catch (error) {
    console.error(`Error fetching stories:`, error);
    return [];
  }
}

// Fetch stories by genre with priority order:
// 1. Stories with single genre matching the target
// 2. Stories with multiple genres where first genre matches
// 3. Stories where target genre is in 2nd or 3rd position
async function fetchStoriesByGenre(genre, limit = 20) {
  try {
    const genreRegex = new RegExp(`^${genre}$`, 'i');
    
    // Priority 1: Single genre stories
    const singleGenreStories = await Story.find({
      published: true,
      genres: { $size: 1 },
      'genres.0': { $regex: genreRegex }
    })
      .populate('author', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    let allStories = singleGenreStories.map(formatStory);
    
    // If we need more stories, fetch Priority 2: Multiple genres with first matching
    if (allStories.length < limit) {
      const remaining = limit - allStories.length;
      const firstGenreStories = await Story.find({
        published: true,
        genres: { $not: { $size: 1 } }, // More than one genre
        'genres.0': { $regex: genreRegex }
      })
        .populate('author', 'name username')
        .sort({ createdAt: -1 })
        .limit(remaining)
        .lean();
      
      allStories = [...allStories, ...firstGenreStories.map(formatStory)];
    }
    
    // If we still need more, fetch Priority 3: Genre in 2nd or 3rd position
    if (allStories.length < limit) {
      const remaining = limit - allStories.length;
      const laterGenreStories = await Story.find({
        published: true,
        genres: { $regex: genreRegex },
        'genres.0': { $not: { $regex: genreRegex } } // First genre doesn't match
      })
        .populate('author', 'name username')
        .sort({ createdAt: -1 })
        .limit(remaining)
        .lean();
      
      allStories = [...allStories, ...laterGenreStories.map(formatStory)];
    }
    
    return allStories.slice(0, limit);
  } catch (error) {
    console.error(`Error fetching stories for genre ${genre}:`, error);
    return [];
  }
}

// Main export function
async function exportHomepageData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📍 Database: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📦 Fetching stories...');

    // Fetch all sections in parallel
    const [
      editorPicks,
      quickReads,
      fantasyStories,
      dramaStories,
      romanceStories,
      sliceOfLifeStories,
      thrillerStories,
      horrorStories,
      comedyStories,
    ] = await Promise.all([
      // Editor Picks
      fetchStories({ published: true, editorPick: true }, { createdAt: -1 }, 6),
      
      // Quick Reads (readTime <= 10)
      fetchStories({ published: true, readTime: { $lte: 10 } }, { createdAt: -1 }, 6),
      
      // Genre sections - Fetch with priority order
      fetchStoriesByGenre('fantasy', 20),
      fetchStoriesByGenre('drama', 20),
      fetchStoriesByGenre('romance', 20),
      fetchStoriesByGenre('slice of life', 20),
      fetchStoriesByGenre('thriller', 20),
      fetchStoriesByGenre('horror', 20),
      fetchStoriesByGenre('comedy', 20),
    ]);

    console.log(`✅ Fetched ${editorPicks.length} editor picks`);
    console.log(`✅ Fetched ${quickReads.length} quick reads`);
    console.log(`✅ Fetched ${fantasyStories.length} fantasy stories`);
    console.log(`✅ Fetched ${dramaStories.length} drama stories`);
    console.log(`✅ Fetched ${romanceStories.length} romance stories`);
    console.log(`✅ Fetched ${sliceOfLifeStories.length} slice of life stories`);
    console.log(`✅ Fetched ${thrillerStories.length} thriller stories`);
    console.log(`✅ Fetched ${horrorStories.length} horror stories`);
    console.log(`✅ Fetched ${comedyStories.length} comedy stories`);

    // Generate the file content
    const fileContent = `// Auto-generated homepage data
// Generated on: ${new Date().toISOString()}
// DO NOT EDIT THIS FILE DIRECTLY - Run 'npm run export-homepage' to regenerate

// Editor's Pick - Curated quality stories
export const EDITOR_PICKS = ${JSON.stringify(editorPicks, null, 2)};

// Quick Reads - Stories under 5 minutes
export const QUICK_READS = ${JSON.stringify(quickReads, null, 2)};

// Genre-specific sections
export const FANTASY_STORIES = ${JSON.stringify(fantasyStories, null, 2)};

export const DRAMA_STORIES = ${JSON.stringify(dramaStories, null, 2)};

export const ROMANCE_STORIES = ${JSON.stringify(romanceStories, null, 2)};

export const SLICE_OF_LIFE_STORIES = ${JSON.stringify(sliceOfLifeStories, null, 2)};

export const THRILLER_STORIES = ${JSON.stringify(thrillerStories, null, 2)};

export const HORROR_STORIES = ${JSON.stringify(horrorStories, null, 2)};

export const COMEDY_STORIES = ${JSON.stringify(comedyStories, null, 2)};
`;

    // Write to file
    const outputPath = path.join(__dirname, '..', 'src', 'constants', 'homepage_data.js');
    fs.writeFileSync(outputPath, fileContent, 'utf8');

    console.log(`\n✅ Successfully exported homepage data to: ${outputPath}`);
    console.log('🎉 Done!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error exporting homepage data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the export
exportHomepageData();
