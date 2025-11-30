import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

/* ---------- helpers (slugify + word lists + generator) ---------- */

function slugify(input = "", maxLen = 24) {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, maxLen)
    .replace(/^-+|-+$/g, "");
}

const ADJECTIVES = [
  "quiet",
  "lucky",
  "brave",
  "curious",
  "silent",
  "golden",
  "silver",
  "stellar",
  "lunar",
  "solar",
  "gentle",
  "wild",
  "merry",
  "neon",
  "velvet",
  "mystic",
  "stormy",
  "frosty",
  "ember",
  "radiant",
  "vivid",
  "primal",
  "cosmic",
  "sable",
  "azure",
  "scarlet",
  "swift",
  "serene",
  "hushed",
  "rosy",
  "roaming",
  "ancient",
  "urban",
  "sage",
  "sly",
  "bold",
  "opal",
  "nocturnal",
  "daylight",
];

const NOUNS = [
  "wanderer",
  "scribe",
  "story",
  "tale",
  "voyager",
  "nomad",
  "pixel",
  "quill",
  "atlas",
  "mirror",
  "comet",
  "harbor",
  "lantern",
  "echo",
  "riddle",
  "muse",
  "harbinger",
  "book",
  "bridge",
  "meadow",
  "fox",
  "raven",
  "ocean",
  "river",
  "garden",
  "engine",
  "cipher",
  "studio",
  "verse",
  "poet",
  "star",
  "dawn",
  "dusk",
  "forest",
  "forge",
  "pulse",
  "clock",
  "canvas",
  "cinder",
  "dynamo",
  "haven",
  "keystone",
];

const MODIFIERS = [
  "hub",
  "labs",
  "works",
  "zone",
  "craft",
  "studio",
  "space",
  "nest",
  "forge",
  "ink",
  "loom",
  "coil",
  "node",
  "core",
  "deck",
  "saga",
];

function randPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildCandidatesFromName(nameFragment) {
  const base = slugify(nameFragment || "", 18);
  const candidates = [];
  if (base) {
    candidates.push(base);
    candidates.push(`${base}-writes`);
    candidates.push(`${base}writer`);
    candidates.push(`${base}-${randPick(NOUNS)}`);
    candidates.push(`${base}-${Math.floor(Math.random() * 99) + 1}`);
    const first = base.split("-")[0];
    if (first && first !== base) {
      candidates.push(first);
      candidates.push(`${first}${randPick(MODIFIERS)}`);
    }
  }
  return candidates;
}

function buildRandomCandidates(batch = 50) {
  const set = new Set();
  while (set.size < batch) {
    const p1 = `${randPick(ADJECTIVES)}-${randPick(NOUNS)}`;
    const p2 = `${randPick(NOUNS)}-${randPick(ADJECTIVES)}`;
    const p3 = `${randPick(ADJECTIVES)}-${randPick(NOUNS)}${
      Math.floor(Math.random() * 90) + 10
    }`;
    const p4 = `${randPick(NOUNS)}${randPick(MODIFIERS)}`;
    const hex = Math.random().toString(16).slice(2, 6);
    const p5 = `${randPick(ADJECTIVES)}-${hex}`;
    [p1, p2, p3, p4, p5].forEach((p) => set.add(slugify(p, 24)));
  }
  return Array.from(set);
}

/**
 * Generate username - tries name-influenced candidates first (if available),
 * then tries many random combos. Returns the first unique username found.
 * NOTE: Does NOT add the @ symbol, this should be done just before saving to DB
 * or before display on the client.
 */
async function generateUniqueUsername({ name, email }) {
  const nameFrag = (name || "").trim();

  const prioritized = [
    ...buildCandidatesFromName(nameFrag),
    ...(nameFrag ? [`${slugify(nameFrag)}-${randPick(ADJECTIVES)}`] : []),
  ]
    .map((c) => slugify(c, 24))
    .filter(Boolean);

  const pool = buildRandomCandidates(200);
  const candidates = [...prioritized, ...pool];

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    if (!candidate || candidate.length < 2) continue;
    // Check if a prefixed version exists in DB
    const prefixedCandidate = `@${candidate}`;
    const exists = await User.findOne({ username: prefixedCandidate }).lean();
    if (!exists) return candidate; // Return the clean slug
  } // fallback: base + hex, guaranteed uniqueness loop with max attempts

  const base = slugify(nameFrag || "user", 12) || "user";
  for (let i = 0; i < 300; i++) {
    const suffix = Math.random().toString(16).slice(2, 8);
    const candidate = slugify(`${base}-${suffix}`, 30);
    // Check if a prefixed version exists in DB
    const prefixedCandidate = `@${candidate}`;
    const exists = await User.findOne({ username: prefixedCandidate }).lean();
    if (!exists) return candidate; // Return the clean slug
  }

  throw new Error("Failed to generate unique username");
}

// ---------------------------------------------------------------- //

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing email or password" }),
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase(); // Check if email already exists

    const exists = await User.findOne({ email: normalizedEmail }).lean();
    if (exists) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
      });
    } // 1. Generate a unique username slug (e.g., "quiet-wanderer")

    const generatedUsernameSlug = await generateUniqueUsername({
      name: "",
      email: normalizedEmail,
    });

    // 2. 🔑 CRITICAL FIX: Add the '@' prefix before saving to the database
    const finalUsername = `@${generatedUsernameSlug}`; // TODO: HASH THE PASSWORD here before creating user

    const user = await User.create({
      email: normalizedEmail,
      password, // replace with hashed password in production
      username: finalUsername, // <-- THIS NOW INCLUDES THE @ PREFIX
      name: "",
    }); // Note: Since username now has the @ prefix, displayUsername is redundant,

    // but we can keep it simple just to pass back the data.
    const safeUser = {
      id: user._id.toString(),
      email: user.email,
      username: user.username, // e.g., "@quiet-wanderer"
      name: user.name,
      bio: user.bio || "",
      profileImage: user.profileImage || "",
      followers: user.followers || [],
      following: user.following || [],
      savedStories: user.savedStories || [],
      likedStories: user.likedStories || [],
      createdAt: user.createdAt,
    };

    return new Response(JSON.stringify(safeUser), { status: 201 });
  } catch (err) {
    console.error("/api/auth/signup error", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
