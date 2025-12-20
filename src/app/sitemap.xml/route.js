// app/sitemap.xml/route.js
// Dynamic sitemap generation for SEO - fetches all stories and authors from DB

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Story from '@/models/Story';
import User from '@/models/User';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thestorybits.com';
  
  try {
    await connectToDB();
    
    // Fetch all published stories
    const stories = await Story.find({ published: true })
      .select('_id updatedAt createdAt')
      .lean();
    
    // Fetch all authors with at least one story
    const authors = await User.find({ username: { $exists: true, $ne: '' } })
      .select('username updatedAt createdAt')
      .lean();
    
    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      // { url: '/contests', priority: '0.9', changefreq: 'weekly' }, // Commented out - not active yet
      { url: '/about', priority: '0.5', changefreq: 'monthly' },
      { url: '/stories', priority: '0.8', changefreq: 'daily' },
    ];
    
    // Genre pages
    const genres = [
      'Fantasy',
      'Sci-Fi',
      'Romance',
      'Thriller',
      'Horror',
      'Adventure',
      'Drama',
      'Slice of Life',
      'Mystery',
      'Comedy'
    ];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Static Pages -->
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  
  <!-- Genre Pages -->
  ${genres.map(genre => `
  <url>
    <loc>${baseUrl}/genre/${encodeURIComponent(genre)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- Story Pages -->
  ${stories.map(story => `
  <url>
    <loc>${baseUrl}/stories/${story._id.toString()}</loc>
    <lastmod>${(story.updatedAt || story.createdAt || new Date()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  <!-- Author Pages -->
  ${authors.map(author => `
  <url>
    <loc>${baseUrl}/authors/${encodeURIComponent(author.username)}</loc>
    <lastmod>${(author.updatedAt || author.createdAt || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
