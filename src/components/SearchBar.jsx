"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div
      className="
        flex items-center gap-2 
        px-3 py-3 rounded-xl
        border border-[var(--foreground)]/15 
        bg-[var(--foreground)]/5
        text-[var(--foreground)]/80
        w-full md:w-64
      "
    >
      <Search className="w-4 h-4 opacity-70" />
      <input
        type="text"
        placeholder="Search stories..."
        className="
          w-full bg-transparent outline-none text-sm 
          text-[var(--foreground)]
        "
      />
    </div>
  );
}
