// app/sitemap.xml/route.js
// Dynamic sitemap generation for SEO

import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://storyverse.com';
  
  try {
    // Fetch all stories, authors, and genres from your database
    // For now, we'll create a basic sitemap structure
    
    const staticPages = [
      '',
      '/login',
      '/write',
    ];
    
    const genres = [
      'Fantasy',
      'Sci-Fi',
      'Romance',
      'Thriller',
      'Horror',
      'Adventure',
      'Drama',
      'Slice%20of%20Life',
      'Mystery',
      'Comedy'
    ];
    
    // TODO: Fetch dynamic data from your database
    // const stories = await fetchAllStories();
    // const authors = await fetchAllAuthors();
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Static Pages -->
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'monthly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.5'}</priority>
  </url>`).join('')}
  
  <!-- Genre Pages -->
  ${genres.map(genre => `
  <url>
    <loc>${baseUrl}/genre/${genre}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- TODO: Add dynamic story pages -->
  <!-- Example:
  ${`
  <url>
    <loc>${baseUrl}/stories/story-id</loc>
    <lastmod>2024-01-01T00:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`}
  -->
  
  <!-- TODO: Add dynamic author pages -->
  <!-- Example:
  ${`
  <url>
    <loc>${baseUrl}/authors/username</loc>
    <lastmod>2024-01-01T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`}
  -->
  
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
