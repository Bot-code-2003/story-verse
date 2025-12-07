"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// --- Shared Modal ---
export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      aria-modal
      role="dialog"
    >
      <div
        className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded-xl shadow-2xl w-full max-w-sm m-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl hover:text-[var(--foreground)]/70 transition"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-6 text-center">{title}</h3>
        {children}
      </div>
    </div>
  );
};

// --- Login Form ---
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

    <button
      disabled={loading}
      type="submit"
      className="w-full py-2 rounded-md bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
    >
      {loading ? "Signing in..." : "Sign in"}
    </button>

    <div className="text-center pt-2">
      <button
        type="button"
        onClick={onSwitchToSignup}
        className="text-sm underline"
      >
        Need to create an account?
      </button>
    </div>
  </form>
);

// --- Signup Form WITH TERMS CHECK ---
const SignupForm = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  loading,
  error,
  onSwitchToLogin,
  termsAccepted,
  setTermsAccepted,
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

    {/* ✅ TERMS & PRIVACY CHECK */}
    <div className="flex items-start gap-2 text-xs text-[var(--foreground)]/70">
      <input
        type="checkbox"
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)}
        className="mt-1"
      />
      <span>
        I agree to the{" "}
        <a
          href="/tandp"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--foreground)]"
        >
          Terms & Privacy Policy
        </a>
      </span>
    </div>

    {error && <div className="text-xs text-red-500">{error}</div>}

    <button
      disabled={loading || !termsAccepted} // ✅ HARD BLOCK
      type="submit"
      className="w-full py-2 rounded-md bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Creating..." : "Create account"}
    </button>

    <div className="text-center pt-2">
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-sm underline"
      >
        Already have an account?
      </button>
    </div>
  </form>
);

// --- Auth Modal ---
export const AuthModal = ({ isOpen, onClose, form = "login" }) => {
  const { login, signup } = useAuth();

  const [activeForm, setActiveForm] = useState(form);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false); // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setTermsAccepted(false);
      setLoading(false);
      setError("");
      setActiveForm(form);
    }
  }, [isOpen, form]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, password });
      onClose();
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ SAFETY CHECK (even if button bypassed)
    if (!termsAccepted) {
      setError("You must agree to the Terms & Privacy Policy.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await signup({ email, password });
      onClose();
    } catch (err) {
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const title = activeForm === "login" ? "Welcome Back" : "Join Us Today";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {activeForm === "login" ? (
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          onSwitchToSignup={() => setActiveForm("signup")}
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
          onSwitchToLogin={() => setActiveForm("login")}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
        />
      )}
    </Modal>
  );
};

// --- Auth Buttons ---
export default function AuthButtons() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState("login");

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm">{user.username || user.email}</span>
        <button
          onClick={logout}
          className="text-xs px-3 py-1 border border-red-500/30 text-red-500 rounded-md"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setModalForm("login");
            setIsModalOpen(true);
          }}
          className="text-sm"
        >
          Log In
        </button>

        <button
          onClick={() => {
            setModalForm("signup");
            setIsModalOpen(true);
          }}
          className="text-sm px-4 py-2 rounded-md bg-[var(--foreground)] text-[var(--background)]"
        >
          Sign Up
        </button>
      </div>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={modalForm}
      />
    </>
  );
}
