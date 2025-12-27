// src/lib/normalizeStories.js
// ⚡ PERFORMANCE: Shared utility for normalizing story data with batch author lookup
// Fixes N+1 query problem by batching all author lookups into a single query

import User from "@/models/User";
import { ObjectId } from "mongodb";

/**
 * Normalizes an array of stories by resolving author references efficiently.
 * Uses batch lookup instead of individual queries (fixes N+1 problem).
 * 
 * @param {Array} stories - Array of story documents from MongoDB (.lean())
 * @returns {Promise<Array>} - Stories with normalized author objects
 */
export async function normalizeStories(stories) {
  if (!stories || stories.length === 0) return [];

  // Step 1: Identify stories with string authors that need lookup
  const stringAuthorIds = [];
  const stringUsernames = [];

  stories.forEach((s) => {
    if (typeof s.author === "string") {
      const authorStr = s.author;
      if (ObjectId.isValid(authorStr)) {
        stringAuthorIds.push(authorStr);
      } else {
        // It's a username (with or without @)
        stringUsernames.push(authorStr.replace(/^@/, ""));
      }
    }
  });

  // Step 2: Batch fetch all users in ONE query (instead of N queries)
  let userMap = new Map();

  if (stringAuthorIds.length > 0 || stringUsernames.length > 0) {
    const orConditions = [];
    
    if (stringAuthorIds.length > 0) {
      orConditions.push({ _id: { $in: stringAuthorIds.map(id => new ObjectId(id)) } });
    }
    
    if (stringUsernames.length > 0) {
      orConditions.push({ username: { $in: stringUsernames } });
    }

    const users = await User.find({ $or: orConditions })
      .select("_id username name profileImage")
      .lean();

    // Build lookup maps
    users.forEach((u) => {
      userMap.set(u._id.toString(), u);
      if (u.username) {
        userMap.set(u.username.toLowerCase(), u);
      }
    });
  }

  // Step 3: Normalize stories (no async/await needed - all data is preloaded)
  return stories.map((s) => {
    const ns = { ...s };
    ns.id = ns._id?.toString?.();

    // ⚡ PERFORMANCE: Prefer authorSnapshot (denormalized, no populate needed)
    if (ns.authorSnapshot && (ns.authorSnapshot.name || ns.authorSnapshot.username)) {
      ns.author = {
        id: ns.author?._id?.toString?.() || (typeof ns.author === 'string' ? ns.author : null),
        username: ns.authorSnapshot.username || null,
        name: ns.authorSnapshot.name || null,
        profileImage: ns.authorSnapshot.profileImage || null,
      };
      return ns;
    }

    // Case 1: Author already populated as an object
    if (ns.author && typeof ns.author === "object" && ns.author._id) {
      ns.author = {
        id: String(ns.author._id),
        username: ns.author.username || null,
        name: ns.author.name || null,
        profileImage: ns.author.profileImage || null,
      };
      return ns;
    }

    // Case 2: Author is a string (ObjectId or username)
    if (typeof ns.author === "string") {
      const authorStr = ns.author;
      
      // Try to find by ObjectId
      let userDoc = userMap.get(authorStr);
      
      // Try to find by username (lowercase)
      if (!userDoc) {
        const cleanUsername = authorStr.replace(/^@/, "").toLowerCase();
        userDoc = userMap.get(cleanUsername);
      }

      if (userDoc) {
        ns.author = {
          id: String(userDoc._id),
          username: userDoc.username,
          name: userDoc.name,
          profileImage: userDoc.profileImage,
        };
        return ns;
      }

      // Fallback: keep as plain string author
      ns.author = { id: authorStr, username: authorStr };
      return ns;
    }

    // Case 3: No author info
    ns.author = {
      id: null,
      username: null,
      name: null,
      profileImage: null,
    };
    return ns;
  });
}

export default normalizeStories;
