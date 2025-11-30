"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image for optimized external images
// Assuming you have this context for user/auth methods
import { useAuth } from "@/context/AuthContext";

// --- 1. Reusable Modal Component (No Change) ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-xl shadow-2xl w-full max-w-sm m-4 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl hover:text-[var(--foreground)]/70 transition"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-6 text-center">{title}</h3>
        {children}
      </div>
    </div>
  );
};

// --- Profile Avatar Helper Component (NEW) ---

const ProfileAvatar = ({ user }) => {
  const sizeClass = "w-10 h-10"; // Common size class

  // Determine the display name for the avatar (prefer name, then username)
  const displayName = user.username || user.email || "?";
  const initial = displayName.charAt(1).toUpperCase();

  // Check if a profile image URL exists
  if (user.profileImage) {
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden border border-[var(--foreground)]/10`}
      >
        {/* Using next/image for optimized images */}
        <Image
          src={user.profileImage}
          alt={`${displayName}'s avatar`}
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
    );
  }

  // Fallback to initial if no profile image
  return (
    <div
      className={`${sizeClass} rounded-full border border-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 flex items-center justify-center font-bold text-sm`}
    >
      {initial}
    </div>
  );
};

// --- 2. Profile Dropdown Component (UPDATED) ---

const ProfileDropdown = ({ user, logout }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Determine what to display in the menu header (prefer name, then username)
  const profileName = user.username || user.email;

  // Define the common menu items
  const menuItems = [
    {
      name: "My Profile",
      action: () => {
        setIsOpen(false);
        router.push(`/authors/${user.username}`);
      },
      href: `/authors/${user.id}`,
    },
    {
      name: "Settings",
      action: () => {
        setIsOpen(false);
        router.push("/settings");
      },
      href: "/settings",
    },
    {
      name: "Log out",
      action: logout,
      isDanger: true,
    },
  ];

  return (
    <>
      {/* A. MOBILE VIEW (Simple button row for small screens) */}
      <div className="sm:hidden flex items-center gap-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={item.action}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
              item.isDanger
                ? "border border-red-500/50 text-red-500 hover:bg-red-500/10"
                : "border border-[var(--foreground)]/10 text-[var(--foreground)]/90 hover:bg-[var(--foreground)]/5"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* B. DESKTOP VIEW (Avatar and Dropdown Menu) */}
      <div className="relative hidden sm:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 focus:outline-none"
          aria-expanded={isOpen}
        >
          {/* Profile Avatar Component */}
          <ProfileAvatar user={user} />
        </button>

        {/* Dropdown Menu Content */}
        {isOpen && (
          // Add a click listener to the window/document to close this in a real app
          <div className="absolute right-0 mt-2 w-48 bg-[var(--background)] border border-[var(--foreground)]/10 rounded-lg shadow-xl z-50 py-1">
            {/* Displaying Profile Name/Email - UPDATED */}
            <div className="px-4 py-2 text-sm font-semibold text-[var(--foreground)] border-b border-[var(--foreground)]/5 truncate">
              {profileName}
            </div>

            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--foreground)]/5 transition ${
                  item.isDanger ? "text-red-500" : "text-[var(--foreground)]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// --- 3. Login and Signup Forms (No Change) ---

const LoginForm = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  loading,
  error,
  onSwitchToSignup,
}) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-transparent border border-[var(--foreground)]/10"
      required
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-transparent border border-[var(--foreground)]/10"
      required
    />

    {error && <div className="text-xs text-red-500">{error}</div>}

    <div className="flex gap-2 pt-2">
      <button
        disabled={loading}
        type="submit"
        className="flex-1 py-2 rounded-md bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </div>
    <div className="text-center pt-2">
      <button
        type="button"
        onClick={onSwitchToSignup}
        className="text-sm text-[var(--foreground)]/70 hover:text-[var(--foreground)] underline transition"
      >
        Need to create an account?
      </button>
    </div>
  </form>
);

const SignupForm = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  loading,
  error,
  onSwitchToLogin,
}) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-transparent border border-[var(--foreground)]/10"
      required
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-transparent border border-[var(--foreground)]/10"
      required
    />

    {error && <div className="text-xs text-red-500">{error}</div>}

    <div className="flex gap-2 pt-2">
      <button
        disabled={loading}
        type="submit"
        className="flex-1 py-2 rounded-md bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
      >
        {loading ? "Creating..." : "Create account"}
      </button>
    </div>
    <div className="text-center pt-2">
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-sm text-[var(--foreground)]/70 hover:text-[var(--foreground)] underline transition"
      >
        Already have an account?
      </button>
    </div>
  </form>
);

// --- 4. Main AuthButtons Component (No Change) ---

export default function AuthButtons() {
  const { user, login, signup, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openSignupFromLogin = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
    setError("");
  };

  const openLoginFromSignup = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // API call placeholder
      await login({ email, password });
      // Clear inputs and close modal on success
      setIsLoginModalOpen(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // API call placeholder
      await signup({ email, password });
      // Clear inputs and close modal on success
      setIsSignupModalOpen(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Signup failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    // RENDER PROFILE DROPDOWN IF USER IS LOGGED IN
    return <ProfileDropdown user={user} logout={logout} />;
  }

  // RENDER LOGIN/SIGNUP BUTTONS IF USER IS LOGGED OUT
  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setIsLoginModalOpen(true);
            setError(""); // Reset error state when opening
          }}
          className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition"
        >
          Log In
        </button>

        <button
          onClick={() => {
            setIsSignupModalOpen(true);
            setError(""); // Reset error state when opening
          }}
          className="text-sm font-medium px-5 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
        >
          Sign Up
        </button>
      </div>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Welcome Back"
      >
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          onSwitchToSignup={openSignupFromLogin}
        />
      </Modal>

      {/* Signup Modal */}
      <Modal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        title="Join Us Today"
      >
        <SignupForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onSubmit={handleSignup}
          loading={loading}
          error={error}
          onSwitchToLogin={openLoginFromSignup}
        />
      </Modal>
    </>
  );
}
