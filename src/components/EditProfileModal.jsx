"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, User, Lock } from "lucide-react";
import { compressProfileImage } from "@/lib/imageCompression";

const EditProfileModal = ({ isOpen, onClose, user, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    profileImage: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
      });
      setError("");
      setSuccess("");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password fields if changing password
    if (passwordData.newPassword) {
      if (!passwordData.currentPassword) {
        setError("Current password is required to change password");
        return;
      }
      if (passwordData.newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    // Prepare payload
    const payload = {
      ...formData,
      ...(passwordData.newPassword && {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    };

    setIsSaving(true);

    try {
      const response = await fetch(`/api/authors/${user.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update profile");
        return;
      }

      const updatedUser = await response.json();
      // Update local storage
      localStorage.setItem("sf_user", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully!");

      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Call parent callback with updated user
      setTimeout(() => {
        onSave(updatedUser);
        onClose();

        window.location.reload();
      }, 1500);
    } catch (err) {
      setError("An error occurred while updating profile");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[var(--background)] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b border-[var(--foreground)]/10 bg-[var(--background)]">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--foreground)]/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[var(--foreground)]/60" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 160px)" }}
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* Profile Avatar Preview */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-4 border-[var(--foreground)]/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full p-4 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-[var(--foreground)]/10">
                    {(formData.name || user?.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information Section */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-[var(--foreground)]/60" />
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  Profile Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    disabled
                    placeholder="Your username"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)]/60 cursor-not-allowed"
                  />
                  <p className="text-xs text-[var(--foreground)]/50">
                    Username cannot be changed
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)]/60 cursor-not-allowed"
                />
                <p className="text-xs text-[var(--foreground)]/50">
                  Email cannot be changed
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell readers about yourself..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-blue-500 focus:outline-none transition resize-none"
                />
                <p className="text-xs text-[var(--foreground)]/50 text-right">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              {/* Profile Image */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  Profile Image (160x160, WebP, less than 10KB)
                </label>
                
                {/* Upload Button */}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      if (file.size > 2 * 1024 * 1024) {
                        setError("Image too large. Maximum 2MB");
                        return;
                      }
                      
                      setUploadingImage(true);
                      setError("");
                      try {
                        const compressed = await compressProfileImage(file);
                        setFormData(prev => ({ ...prev, profileImage: compressed }));
                        setSuccess("Image uploaded and compressed");
                        setTimeout(() => setSuccess(""), 2000);
                      } catch (error) {
                        setError(error.message || "Failed to compress image");
                      } finally {
                        setUploadingImage(false);
                        e.target.value = "";
                      }
                    }}
                    className="hidden"
                    id="profile-upload"
                  />
                  <div className="w-full px-4 py-3 bg-blue-600 text-white text-center rounded-xl cursor-pointer hover:bg-blue-700 transition font-medium">
                    {uploadingImage ? "Compressing..." : "Upload Image"}
                  </div>
                </label>
                
                {/* URL Input */}
                <div className="text-center text-xs text-[var(--foreground)]/50">or</div>
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password Change Section */}
            <div className="space-y-6 pt-8 border-t border-[var(--foreground)]/10">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-[var(--foreground)]/60" />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    Change Password
                  </h3>
                  <p className="text-sm text-[var(--foreground)]/50">
                    Leave blank to keep current password
                  </p>
                </div>
              </div>

              {/* Current Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-blue-500 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Min. 6 characters"
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-blue-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--foreground)]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm password"
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:border-blue-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer - Sticky Buttons */}
        <div className="sticky bottom-0 z-10 flex gap-3 px-8 py-6 border-t border-[var(--foreground)]/10 bg-[var(--background)]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-[var(--foreground)]/20 text-[var(--foreground)] font-semibold hover:bg-[var(--foreground)]/5 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || loading}
            className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
