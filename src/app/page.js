"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import StoryCard from "@/components/StoryCard";
import { useAuth } from "@/context/AuthContext";
import { fetchWithCache, CACHE_KEYS } from "@/lib/cache";
import { GENRE_TILES } from "@/constants/genres";
import { ArrowRight, BookOpen, Heart, MessageCircle, Users, Sparkles, TrendingUp, Globe, Star } from "lucide-react";
import HeroSection from "@/components/home/Hero";
import TrendingSection from "@/components/home/Trending";
import Genres from "@/components/home/Genres";
import Community from "@/components/home/Community";
import Writers from "@/components/home/Writers";
import BecomeAuthorBanner from "@/components/BecomeAuthorBanner";
import ReadersPicks from "@/components/home/ReadersPicks";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [trendingStories, setTrendingStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem("sf_user") : null;
      if (user || stored) {
        router.push("/home");
      } else {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [user, router]);

  // Fetch trending stories for showcase with caching
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Use cache-first approach with 6-hour TTL
        const stories = await fetchWithCache(
          CACHE_KEYS.TRENDING,
          async () => {
            const res = await fetch("/api/stories/trending");
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data.stories || [];
          }
        );
        setTrendingStories(stories.slice(0, 6)); // Show only 6
      } catch (error) {
        console.error("Failed to fetch trending stories:", error);
        setTrendingStories([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    if (!isChecking) {
      fetchTrending();
    }
  }, [isChecking]);

  if (isChecking) {
    return <div className="min-h-screen bg-[var(--background)]" />; 
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "TheStoryBits - Discover and Share Your Stories",
            "description": "TheStoryBits is a platform for writers and readers to connect, share, and explore a vast collection of stories across various genres.",
            "url": "https://www.thestorybits.com",
            "publisher": {
              "@type": "Organization",
              "name": "TheStoryBits",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.thestorybits.com/logo.png" // Replace with actual logo URL
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.thestorybits.com"
            },
            "potentialAction": [
              {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.thestorybits.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              {
                "@type": "ReadAction",
                "target": "https://www.thestorybits.com/stories"
              },
              {
                "@type": "WriteAction",
                "target": "https://www.thestorybits.com/write"
              }
            ]
          })
        }}
      />
      
      <SiteHeader />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <HeroSection />

        {/* TRENDING NOW SECTION */}
<TrendingSection 
  trendingStories={trendingStories} 
  loading={loading} 
/>

        <Genres />

        <Community />

        {/* <Writers /> */}

        <ReadersPicks />

        <BecomeAuthorBanner />
      </main>
      
      <Footer />
    </div>
  );
}
