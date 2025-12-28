require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_DEV_URI || process.env.DATABASE_URL;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || "c2070ac8eb35bc11bb30f027c52f7f28";

if (!MONGODB_URI) {
  console.error(`No MONGODB_LOCAL_URI or DATABASE_URL found in .env.local`);
  process.exit(1);
}

const storySchema = new mongoose.Schema({
  title: String,
  coverImage: String,
}, { strict: false });

const Story = mongoose.models.Story || mongoose.model('Story', storySchema);

async function uploadToImgBB(base64String, title) {
  try {
    // Remove header to get pure base64
    // e.g., "data:image/jpeg;base64,/9j/4AAQSkZJRg..." -> "/9j/4AAQSkZJRg..."
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    const params = new URLSearchParams();
    params.append("key", IMGBB_API_KEY);
    params.append("image", base64Data);
    if (title) params.append("name", title.substring(0, 32)); // ImgBB has length limits sometimes

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: params,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      console.error(`ImgBB Upload Failed for "${title}":`, data.error ? data.error.message : data);
      return null;
    }
  } catch (error) {
    console.error(`Error uploading "${title}":`, error.message);
    return null;
  }
}

async function migrateImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");

    // Find all stories with base64 images
    const storiesToUpdate = await Story.find({ 
      coverImage: { $regex: /^data:image/ } 
    });

    console.log(`Found ${storiesToUpdate.length} stories with Base64 images to migrate.`);

    let successCount = 0;
    let failCount = 0;

    for (const story of storiesToUpdate) {
      console.log(`Processing: "${story.title}"...`);
      
      const newUrl = await uploadToImgBB(story.coverImage, story.title);

      if (newUrl) {
        story.coverImage = newUrl;
        await story.save();
        console.log(`  -> Success! Updated to: ${newUrl}`);
        successCount++;
      } else {
        console.log(`  -> Failed to upload.`);
        failCount++;
      }
      
      // Small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\nMigration Complete.`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);

  } catch (error) {
    console.error("Error migrating DB:", error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateImages();
