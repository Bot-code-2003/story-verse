"use client";

import React from "react";
import { Heart, MessageCircle } from "lucide-react";

/* -------------------------------- mock data -------------------------------- */
const FLOATING_COMMENTS = [
  {
    user: "Elena Moore",
    text: "This story felt carefully held together.",
    likes: 52,
    avatar: "https://i.pinimg.com/1200x/f4/52/0b/f4520b97cf31e3dc1782976b43790b15.jpg",
  },
  {
    user: "Jonah Reed",
    text: "I finished this and just sat there for a while.",
    likes: 61,
    avatar: "https://i.pinimg.com/736x/fa/11/d0/fa11d05275ba52485c2f964eef620f52.jpg",
  },
  {
    user: "Mira Collins",
    text: "The kind of ending that quietly stays with you.",
    likes: 47,
    avatar: "https://i.pinimg.com/736x/71/2d/58/712d5802368e0a7cafc9f530e328daf4.jpg",
  },
  {
    user: "Sam Torres",
    text: "I keep thinking about the last chapter.",
    likes: 38,
    avatar: "https://i.pinimg.com/1200x/f4/52/0b/f4520b97cf31e3dc1782976b43790b15.jpg",
  },
  {
    user: "Ava Chen",
    text: "The writing made me slow down in the best way.",
    likes: 54,
    avatar: "https://i.pinimg.com/736x/fa/11/d0/fa11d05275ba52485c2f964eef620f52.jpg",
  },
  {
    user: "Leo Park",
    text: "Stories like this remind me why I read.",
    likes: 43,
    avatar: "https://i.pinimg.com/736x/71/2d/58/712d5802368e0a7cafc9f530e328daf4.jpg",
  },
];

const Community = () => {
  return (
    <section className="relative py-16 md:py-24 px-6 bg-[#e7f2e4] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#5a7a53] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#5a7a53] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#2d3a2a] leading-tight mb-6">
            A space for readers
            <br />
            <span className="text-[#5a7a53]">who take their time.</span>
          </h2>
          <p className="text-lg md:text-xl text-[#5a6358] max-w-2xl mx-auto leading-relaxed">
            Share highlights, leave notes, discover what others loved.
          </p>
        </div>

        {/* Masonry-style comment grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {/* Mobile: show first 3, Tablet: show all */}
          {FLOATING_COMMENTS.slice(0, 3).map((comment, idx) => (
            <CommentCardLight key={idx} comment={comment} />
          ))}
          
          {FLOATING_COMMENTS.slice(3).map((comment, idx) => (
            <CommentCardLight key={idx + 3} comment={comment} className="hidden md:block" />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <p className="font-serif italic text-[#5a7a53] text-lg md:text-xl mb-6">
            "Books worth reading deserve conversations worth having."
          </p>
          {/* <button className="px-8 py-3 bg-[#5a7a53] hover:bg-[#6a8a63] text-white rounded-full font-medium transition-all duration-300 hover:scale-105">
            Join the Community
          </button> */}
        </div>
      </div>
    </section>
  );
};

// Light theme comment card component
const CommentCardLight = ({ comment, className = "" }) => (
  <div className={`group rounded-2xl bg-white border border-[#c5d8c1]/40 px-6 py-5 hover:border-[#5a7a53]/50 hover:shadow-lg transition-all duration-300 ${className}`}>
    <div className="flex items-start gap-4 text-left">
      <img
        src={comment.avatar}
        alt={comment.user}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-[#c5d8c1]/30 group-hover:ring-[#5a7a53]/40 transition-all"
      />
      <div className="flex-1">
        <p className="text-sm md:text-base text-[#2d3a2a] leading-relaxed mb-1">
          "{comment.text}"
        </p>
        <p className="text-xs text-[#5a6358]/60 mb-3">— {comment.user}</p>
        <div className="flex items-center gap-4 text-xs text-[#5a6358]/50">
          <div className="flex items-center gap-1.5 group-hover:text-[#5a7a53] transition-colors">
            <Heart size={14} className="fill-current" />
            {comment.likes}
          </div>
          <button className="flex items-center gap-1.5 hover:text-[#5a7a53] transition-colors">
            <MessageCircle size={14} />
            Reply
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Community;