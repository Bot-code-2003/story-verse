"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

// Import the new standalone modal
import { AuthModal } from "@/components/AuthModal";

// --- Profile Avatar (unchanged) ---
const ProfileAvatar = ({ user }) => {
  const sizeClass = "w-10 h-10";
  const displayName = user.username || user.email || "?";
  const initial = displayName.charAt(1).toUpperCase();

  if (user.profileImage) {
    return (
      <div
        className={`${sizeClass} rounded-full overflow-hidden border border-[var(--foreground)]/10`}
      >
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

  return (
    <div
      className={`${sizeClass} rounded-full border border-[var(--foreground)]/10 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 flex items-center justify-center font-bold text-sm`}
    >
      {initial}
    </div>
  );
};

// --- Profile Dropdown (unchanged) ---
const ProfileDropdown = ({ user, logout }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const profileName = user.username || user.email;

  const menuItems = [
    {
      name: "My Profile",
      action: () => {
        setIsOpen(false);
        router.push(`/authors/${user.username}`);
      },
    },
    {
      name: "Log out",
      action: logout,
      isDanger: true,
    },
  ];

  return (
    <>
      {/* Mobile */}
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

      {/* Desktop */}
      <div className="relative hidden sm:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <ProfileAvatar user={user} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[var(--background)] border border-[var(--foreground)]/10 rounded-lg shadow-xl z-50 py-1">
            <div className="px-4 py-2 text-sm font-semibold border-b border-[var(--foreground)]/5 truncate">
              {profileName}
            </div>

            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-[var(--foreground)]/5 ${
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

// --- Rewritten AuthButtons (using AuthModal) ---
export default function AuthButtons() {
  const { user, logout } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState("login"); // "login" | "signup"

  if (user) {
    return <ProfileDropdown user={user} logout={logout} />;
  }

  return (
    <>
      <div className="flex items-center gap-4">
        {/* LOGIN BUTTON */}
        <button
          onClick={() => {
            setFormType("login");
            setIsModalOpen(true);
          }}
          className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition"
        >
          Log In
        </button>

        {/* SIGNUP BUTTON */}
        <button
          onClick={() => {
            setFormType("signup");
            setIsModalOpen(true);
          }}
          className="text-sm font-medium px-5 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
        >
          Sign Up
        </button>
      </div>

      {/* Standalone Modal Component */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={formType}
      />
    </>
  );
}
