"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";

/* =====================
   LOGIN FORM (UNCHANGED)
   ===================== */
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
  <form onSubmit={onSubmit} className="space-y-5">
    <div>
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition text-gray-900 placeholder:text-gray-400"
        required
      />
    </div>
    <div>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition text-gray-900 placeholder:text-gray-400"
        required
      />
    </div>
    {error && (
      <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
        {error}
      </div>
    )}
    <button
      disabled={loading}
      type="submit"
      className="w-full py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Signing in..." : "Sign In"}
    </button>
    <div className="text-center pt-2">
      <button
        type="button"
        onClick={onSwitchToSignup}
        className="text-sm text-gray-600 hover:text-gray-900 transition"
      >
        Don't have an account?{" "}
        <span className="font-semibold text-blue-600 hover:text-blue-700">
          Sign up
        </span>
      </button>
    </div>
  </form>
);

/* ======================
   SIGNUP FORM (UPDATED)
   ====================== */

const SignupForm = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  loading,
  error,
  onSwitchToLogin,
  termsAccepted,          // ✅ NEW
  setTermsAccepted,       // ✅ NEW
  onOpenTerms,            // ✅ NEW
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <div>
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition text-gray-900 placeholder:text-gray-400"
        required
      />
    </div>
    <div>
      <input
        type="password"
        placeholder="Password (min. 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition text-gray-900 placeholder:text-gray-400"
        required
        minLength={6}
      />
    </div>

    {/* ✅ NEW: Terms checkbox */}
    <div className="flex items-start gap-2 text-sm text-gray-600">
      <input
        id="terms"
        type="checkbox"
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor="terms" className="leading-snug">
        I agree to the{" "}
        <a
          type="button"
          href="/tandp"
          target="_blank"
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Terms of Use and Privacy Policy
        </a>{" "}
        .
      </label>
    </div>

    {error && (
      <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
        {error}
      </div>
    )}

    <button
      disabled={loading || !termsAccepted}   // ✅ Block signup until checked
      type="submit"
      className="w-full py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Creating account..." : "Create Account"}
    </button>

    <div className="text-center pt-2">
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-sm text-gray-600 hover:text-gray-900 transition"
      >
        Already have an account?{" "}
        <span className="font-semibold text-blue-600 hover:text-blue-700">
          Sign in
        </span>
      </button>
    </div>
  </form>
);

export default function LoginPage() {
  const { user, login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ NEW: Terms state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  if (user) return null;

  const onSwitchToSignup = () => {
    setView("signup");
    setError("");
    setTermsAccepted(false); // reset
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
      router.push(redirectTo);
    } catch (err) {
      setError(err.message || "Login failed. Check credentials.");
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ Guard on terms (extra safety even though button is disabled)
    if (!termsAccepted) {
      setError("You must agree to the terms before creating an account.");
      setLoading(false);
      return;
    }

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
          "url('https://cdn.pixabay.com/photo/2023/03/17/14/26/bear-7858736_1280.jpg')",
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
                  termsAccepted={termsAccepted}          // ✅
                  setTermsAccepted={setTermsAccepted}    // ✅
                  onOpenTerms={() => setShowTermsModal(true)} // ✅
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
