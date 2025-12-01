"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

// --- Shared Modal (backdrop + panel) ---
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

// --- Login and Signup form components (kept self-contained) ---
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

// ---  AuthModal: a standalone modal that can show login or signup via `form` prop ---
// props:
// - isOpen: boolean
// - onClose: fn
// - form: "login" | "signup" (initial form to show)
// - login/signup handlers come from useAuth when used inside the app
export const AuthModal = ({ isOpen, onClose, form = "login" }) => {
  const { login, signup } = useAuth();
  const [activeForm, setActiveForm] = useState(form); // "login" or "signup"

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // reset states when opened
      setEmail("");
      setPassword("");
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
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup({ email, password });
      onClose();
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err?.message || "Signup failed. Try a different email.");
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
        />
      )}
    </Modal>
  );
};

// --- Default export: AuthButtons demonstrating how to use <AuthModal form="..." /> ---
export default function AuthButtons() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState("login"); // which tab the modal should show when opened

  // If logged in, user likely wants ProfileDropdown (not included here). Keep behaviour minimal.
  if (user) {
    return (
      <div className="flex items-center gap-4">
        {/* You can replace this with your existing ProfileDropdown component */}
        <div className="text-sm">{user.username || user.email}</div>
        <button
          onClick={logout}
          className="text-sm font-medium px-3 py-1 rounded-md border border-red-500/30 text-red-500"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setModalForm("login");
            setIsModalOpen(true);
          }}
          className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition"
        >
          Log In
        </button>

        <button
          onClick={() => {
            setModalForm("signup");
            setIsModalOpen(true);
          }}
          className="text-sm font-medium px-5 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
        >
          Sign Up
        </button>
      </div>

      {/* Use the standalone AuthModal and pass the initial form via `form` prop */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={modalForm}
      />
    </>
  );
}

/*
USAGE NOTES:
- Place this file at: components/AuthModal.jsx
- Import AuthButtons from the file where you currently show auth buttons (or import { AuthModal } to show modal manually)
- The AuthModal uses your useAuth() context for login/signup. Keep that provider at app-level.
*/
