require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_DEV_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error(`No MONGODB_LOCAL_URI or DATABASE_URL found in .env.local`);
  process.exit(1);
}

const storySchema = new mongoose.Schema({
  title: String,
  coverImage: String,
});
// Prevent overwriting model if it exists
const Story = mongoose.models.Story || mongoose.model('Story', storySchema);

async function checkImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // Count stories with base64 images
    // Base64 images typically start with "data:image"
    const base64Count = await Story.countDocuments({ 
      coverImage: { $regex: /^data:image/ } 
    });

    const totalCount = await Story.countDocuments();

    console.log(`\n--- DATABASE IMAGE STATUS ---`);
    console.log(`Total Stories: ${totalCount}`);
    console.log(`Stories with Base64 Images: ${base64Count}`);
    console.log(`Stories with URLs (Optimized): ${totalCount - base64Count}`);

    if (base64Count > 0) {
      console.log("\nWARNING: You still have Base64 images in your database.");
      console.log("These WILL consume 'Fast Origin Transfer' bandwidth when a user reads the story.");
      
      // Get sample
      const sample = await Story.findOne({ coverImage: { $regex: /^data:image/ } }).select('title coverImage');
      console.log(`Sample: "${sample.title}" has image size: ~${Math.round(sample.coverImage.length / 1024)} KB`);
    } else {
      console.log("\nSUCCESS: No Base64 images found. Your database is fully optimized!");
    }

  } catch (error) {
    console.error("Error checking DB:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkImages();
