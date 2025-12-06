"use client";

import React, { useState, useEffect } from "react"; // Added useEffect
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";

// ... [Keep LoginForm and SignupForm components exactly as they are] ...
const LoginForm = ({ email, password, setEmail, setPassword, onSubmit, loading, error, onSwitchToSignup }) => (
  <form onSubmit={onSubmit} className="space-y-5">
    {/* ... inputs ... */}
    <div>
      <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition text-gray-900 placeholder:text-gray-400" required />
    </div>
    <div>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition text-gray-900 placeholder:text-gray-400" required />
    </div>
    {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</div>}
    <button disabled={loading} type="submit" className="w-full py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Signing in..." : "Sign In"}</button>
    <div className="text-center pt-2">
      <button type="button" onClick={onSwitchToSignup} className="text-sm text-gray-600 hover:text-gray-900 transition">Don't have an account? <span className="font-semibold text-blue-600 hover:text-blue-700">Sign up</span></button>
    </div>
  </form>
);

const SignupForm = ({ email, password, setEmail, setPassword, onSubmit, loading, error, onSwitchToLogin }) => (
  <form onSubmit={onSubmit} className="space-y-5">
    {/* ... inputs ... */}
    <div>
      <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition text-gray-900 placeholder:text-gray-400" required />
    </div>
    <div>
      <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition text-gray-900 placeholder:text-gray-400" required minLength={6} />
    </div>
    {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</div>}
    <button disabled={loading} type="submit" className="w-full py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Creating account..." : "Create Account"}</button>
    <div className="text-center pt-2">
      <button type="button" onClick={onSwitchToLogin} className="text-sm text-gray-600 hover:text-gray-900 transition">Already have an account? <span className="font-semibold text-blue-600 hover:text-blue-700">Sign in</span></button>
    </div>
  </form>
);

export default function LoginPage() {
  const { user, login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Calculate redirect path
  const redirectTo = searchParams.get("redirect") || "/";

  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. FIXED: Use useEffect to handle the redirect to avoid render-cycle errors
  // AND use the 'redirectTo' variable instead of hardcoding "/"
  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  // 3. Return null while redirecting to prevent flash of content
  if (user) return null;

  const onSwitchToSignup = () => {
    setView("signup");
    setError("");
  };

  const onSwitchToLogin = () => {
    setView("login");
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
      // The useEffect above will handle the redirect once 'user' state updates
      // But we can keep this here for immediate redundancy
      router.push(redirectTo);
    } catch (err) {
      setError(err.message || "Login failed. Check credentials.");
      setLoading(false); // Only stop loading on error, otherwise keep loading till redirect
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup({ email, password });
      router.push(redirectTo);
    } catch (err) {
      setError(err.message || "Signup failed. Try a different email.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/8e/ed/54/8eed548670f115f05ee16f55e6ca5e97.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block text-white space-y-8">
            <div className="space-y-6">
              <Link href="/" className="text-6xl font-bold leading-tight">
                StoryVerse
              </Link>
            </div>
          </div>

          {/* Right Side - Form Card */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-gray-900" />
                  <span className="text-xl font-bold text-gray-900">
                    StoryVerse
                  </span>
                </Link>
              </div>

              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {view === "login" ? "Welcome Back" : "Get Started"}
                </h2>
                <p className="text-gray-600">
                  {view === "login"
                    ? "Sign in to continue your journey"
                    : "Create your account to start exploring"}
                </p>
              </div>

              {/* Form */}
              {view === "login" ? (
                <LoginForm
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  onSubmit={handleLogin}
                  loading={loading}
                  error={error}
                  onSwitchToSignup={onSwitchToSignup}
                />
              ) : (
                <SignupForm
                  email={email}
                  password={password}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  onSubmit={handleSignup}
                  loading={loading}
                  error={error}
                  onSwitchToLogin={onSwitchToLogin}
                />
              )}

              {/* Back Link */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-900 transition"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}