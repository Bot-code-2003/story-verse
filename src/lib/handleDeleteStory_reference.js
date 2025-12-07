// Add this function to AuthorPage.jsx after the loadMore function

async function handleDeleteStory(storyId) {
  if (!confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
    return;
  }

  setDeletingStoryId(storyId);
  try {
    const userId = loggedInUser?._id || loggedInUser?.id;
    const res = await fetch(
      `/api/stories/${storyId}/delete?userId=${userId}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete story");
    }

    // Remove story from local state
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    alert("Story deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
    alert(error.message || "Failed to delete story");
  } finally {
    setDeletingStoryId(null);
  }
}
