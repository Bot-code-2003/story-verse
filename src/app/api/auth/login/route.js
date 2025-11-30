import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

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

    const user = await User.findOne({ email, password }).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const safeUser = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profileImage: user.profileImage,
      followers: user.followers,
      following: user.following,
      savedStories: user.savedStories,
      likedStories: user.likedStories,
      createdAt: user.createdAt,
    };

    return new Response(JSON.stringify(safeUser), { status: 200 });
  } catch (err) {
    console.error("/api/auth/login error", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
