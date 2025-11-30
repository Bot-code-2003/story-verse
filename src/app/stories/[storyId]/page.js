// app/stories/[storyId]/page.js

// This is a Server Component, responsible for routing

// Important: Adjust the path to your components folder
import StoryPage from "@/components/StoryPage";

// This function receives the route parameters
export default function StoryRoutePage() {
  // StoryPage.jsx is a client component and handles fetching the ID
  // and data itself using useParams, so we just render it here.
  return <StoryPage />;
}
