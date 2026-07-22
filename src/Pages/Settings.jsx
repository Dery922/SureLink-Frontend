// src/pages/Settings.jsx - Fixed version

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCustomMessage } from "../components/CustomMessage";
import {
  FaUser,
  FaUserCog,
  FaBell,
  FaShieldAlt,
  FaTrash,
  FaUserCircle,
  FaExchangeAlt,
  FaSpinner,
  FaLock,
  FaCamera,
} from "react-icons/fa";
import {
  updateUserProfile,
  switchUserRole,
  updateNotificationSettings,
  deleteAccount,
  deactivateAccount,
  getNotificationSettings,
} from "../services/userService";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { success, error, info, warning, confirmModal } = useCustomMessage();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: null,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    bookingUpdates: true,
    promotionalEmails: false,
    serviceReminders: true,
    providerUpdates: true,
    newMessages: true,
  });

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: false,
    accountVisibility: "public",
    language: "en",
  });

  // Fetch user data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user?.name?.full || user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        location: user?.location || "",
        bio: user?.bio || "",
        avatar: user?.avatar || null,
      });

      // Set avatar preview if there's an existing avatar URL
      if (user?.avatar?.url || user?.avatar) {
        const avatarUrl = user?.avatar?.url || user?.avatar;
        setAvatarPreview(avatarUrl);
      }

      // Fetch notification settings
      fetchNotificationSettings();
    }
  }, [user]);

  const fetchNotificationSettings = async () => {
    try {
      const response = await getNotificationSettings();
      if (response.success) {
        setNotificationSettings(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch notification settings:", err);
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setProfileData({ ...profileData, avatar: file });
    }
  };

  // Clean up avatar preview URL when component unmounts or avatar changes
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);
      formData.append("location", profileData.location);
      formData.append("bio", profileData.bio);
      if (profileData.avatar instanceof File) {
        formData.append("avatar", profileData.avatar);
      }

      const response = await updateUserProfile(formData);
      if (response.success) {
        success("Profile updated successfully!");
        setIsEditing(false);
        // Update the avatar preview with the new URL from response
        if (response.data?.avatar?.url) {
          setAvatarPreview(response.data.avatar.url);
        }
      } else {
        error(response.message || "Failed to update profile");
      }
    } catch (err) {
      error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle role switching
  const handleRoleSwitch = async () => {
    confirmModal(
      "Switch Account Role",
      `Are you sure you want to switch from ${user?.role || "customer"} to ${user?.role === "provider" ? "customer" : "provider"} account? ${user?.role === "customer" ? "You will be able to offer services to others." : "You will be able to book services from other providers."}`,
      async () => {
        setIsSwitchingRole(true);
        try {
          const response = await switchUserRole();
          if (response.success) {
            success(`Successfully switched to ${response.data.role} account!`);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            error(response.message || "Failed to switch role");
          }
        } catch (err) {
          error("Failed to switch role. Please try again.");
        } finally {
          setIsSwitchingRole(false);
        }
      },
      () => {
        info("Role switch cancelled");
      },
    );
  };

  // Handle notification settings update
  const handleNotificationUpdate = async (key, value) => {
    const updatedSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(updatedSettings);

    try {
      const response = await updateNotificationSettings(updatedSettings);
      if (response.success) {
        success("Notification settings updated!");
      } else {
        error("Failed to update notification settings");
        // Revert on error - fetch current settings
        await fetchNotificationSettings();
      }
    } catch (err) {
      error("Failed to update notification settings");
      await fetchNotificationSettings();
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    confirmModal(
      "Delete Account",
      "⚠️ This action is permanent and cannot be undone. All your data, bookings, and information will be permanently deleted. Are you sure you want to proceed?",
      async () => {
        const confirmText = prompt(
          'Please type "DELETE" to confirm account deletion:',
        );
        if (confirmText === "DELETE") {
          setIsLoading(true);
          try {
            const response = await deleteAccount();
            if (response.success) {
              success("Account deleted successfully");
              setTimeout(() => {
                navigate("/logout");
              }, 1500);
            } else {
              error(response.message || "Failed to delete account");
            }
          } catch (err) {
            error("Failed to delete account. Please try again.");
          } finally {
            setIsLoading(false);
          }
        } else {
          warning("Account deletion cancelled");
        }
      },
      () => {
        info("Account deletion cancelled");
      },
    );
  };

  // Handle account deactivation
  const handleDeactivateAccount = () => {
    confirmModal(
      "Deactivate Account",
      "Your account will be temporarily deactivated. You can reactivate it anytime by logging in again. Are you sure?",
      async () => {
        setIsLoading(true);
        try {
          const response = await deactivateAccount();
          if (response.success) {
            success("Account deactivated successfully");
            setTimeout(() => {
              navigate("/logout");
            }, 1500);
          } else {
            error(response.message || "Failed to deactivate account");
          }
        } catch (err) {
          error("Failed to deactivate account. Please try again.");
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        info("Account deactivation cancelled");
      },
    );
  };

  // Toggle switch component
  const ToggleSwitch = ({ isOn, onToggle, label, description }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-[#1A1A1A]">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          isOn ? "bg-[#0057FF]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  // Render Profile Tab
  const renderProfileTab = () => (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">
            Profile Settings
          </h2>
          <p className="text-gray-500">Manage your personal information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-[#0057FF] border border-[#0057FF] rounded-lg hover:bg-blue-50 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <form onSubmit={handleProfileUpdate}>
        <div className="bg-white rounded-2xl border border-[#E8F0FF] p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<FaUserCircle className="w-full h-full text-gray-400" />';
                    }}
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-gray-400" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-1 bg-[#0057FF] rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <FaCamera className="text-white text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>
            <div>
              <h3 className="font-bold text-[#1A1A1A]">
                {profileData.fullName || "Your Name"}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {user?.role || "Customer"}
              </p>
              <p className="text-sm text-gray-400">
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-2 border ${isEditing ? "border-[#E8F0FF] focus:border-[#0057FF]" : "border-transparent bg-gray-50"} rounded-xl focus:outline-none transition-colors`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-2 border ${isEditing ? "border-[#E8F0FF] focus:border-[#0057FF]" : "border-transparent bg-gray-50"} rounded-xl focus:outline-none transition-colors`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-2 border ${isEditing ? "border-[#E8F0FF] focus:border-[#0057FF]" : "border-transparent bg-gray-50"} rounded-xl focus:outline-none transition-colors`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) =>
                  setProfileData({ ...profileData, location: e.target.value })
                }
                disabled={!isEditing}
                className={`w-full px-4 py-2 border ${isEditing ? "border-[#E8F0FF] focus:border-[#0057FF]" : "border-transparent bg-gray-50"} rounded-xl focus:outline-none transition-colors`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              disabled={!isEditing}
              rows="3"
              className={`w-full px-4 py-2 border ${isEditing ? "border-[#E8F0FF] focus:border-[#0057FF]" : "border-transparent bg-gray-50"} rounded-xl focus:outline-none transition-colors resize-none`}
              placeholder="Tell us about yourself..."
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8F0FF]">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset avatar preview to original
                  if (user?.avatar?.url || user?.avatar) {
                    setAvatarPreview(user?.avatar?.url || user?.avatar);
                  } else {
                    setAvatarPreview(null);
                  }
                  // Reset form data
                  setProfileData({
                    fullName: user?.name?.full || user?.fullName || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    location: user?.location || "",
                    bio: user?.bio || "",
                    avatar: null,
                  });
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#0057FF] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );

  // Render Account Tab
  const renderAccountTab = () => (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
        Account Settings
      </h2>
      <p className="text-gray-500 mb-6">
        Manage your account preferences and security
      </p>

      <div className="bg-white rounded-2xl border border-[#E8F0FF] divide-y divide-[#E8F0FF]">
        {/* Role Switch */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FaExchangeAlt className="text-[#0057FF]" />
                <h3 className="font-bold text-[#1A1A1A]">Account Role</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                You are currently a{" "}
                <strong className="text-[#1A1A1A] capitalize">
                  {user?.role || "customer"}
                </strong>
              </p>
              <p className="text-sm text-gray-400">
                {user?.role === "provider"
                  ? "Switch to customer account to book services"
                  : "Switch to provider account to offer services"}
              </p>
            </div>
            <button
              onClick={handleRoleSwitch}
              disabled={isSwitchingRole}
              className="px-4 py-2 bg-[#0057FF] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            >
              {isSwitchingRole ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Switching...
                </>
              ) : (
                <>
                  Switch to{" "}
                  {user?.role === "provider" ? "Customer" : "Provider"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaLock className="text-[#0057FF]" />
                <h3 className="font-bold text-[#1A1A1A]">
                  Two-Factor Authentication
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <ToggleSwitch
              isOn={accountSettings.twoFactorAuth}
              onToggle={() => {
                setAccountSettings({
                  ...accountSettings,
                  twoFactorAuth: !accountSettings.twoFactorAuth,
                });
                success(
                  `${accountSettings.twoFactorAuth ? "Disabled" : "Enabled"} 2FA`,
                );
              }}
            />
          </div>
        </div>

        {/* Account Visibility */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaUser className="text-[#0057FF]" />
                <h3 className="font-bold text-[#1A1A1A]">Account Visibility</h3>
              </div>
              <p className="text-sm text-gray-500">
                Control who can see your profile
              </p>
            </div>
            <select
              value={accountSettings.accountVisibility}
              onChange={(e) => {
                setAccountSettings({
                  ...accountSettings,
                  accountVisibility: e.target.value,
                });
                success(`Visibility set to ${e.target.value}`);
              }}
              className="px-4 py-2 border border-[#E8F0FF] rounded-lg focus:outline-none focus:border-[#0057FF]"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="providers-only">Providers Only</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Notifications Tab
  const renderNotificationsTab = () => (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
        Notification Preferences
      </h2>
      <p className="text-gray-500 mb-6">
        Choose what notifications you want to receive
      </p>

      <div className="bg-white rounded-2xl border border-[#E8F0FF] p-6">
        <div className="space-y-1">
          <ToggleSwitch
            isOn={notificationSettings.emailNotifications}
            onToggle={() =>
              handleNotificationUpdate(
                "emailNotifications",
                !notificationSettings.emailNotifications,
              )
            }
            label="Email Notifications"
            description="Receive notifications via email"
          />
          <ToggleSwitch
            isOn={notificationSettings.pushNotifications}
            onToggle={() =>
              handleNotificationUpdate(
                "pushNotifications",
                !notificationSettings.pushNotifications,
              )
            }
            label="Push Notifications"
            description="Receive push notifications on your device"
          />
          <ToggleSwitch
            isOn={notificationSettings.smsNotifications}
            onToggle={() =>
              handleNotificationUpdate(
                "smsNotifications",
                !notificationSettings.smsNotifications,
              )
            }
            label="SMS Notifications"
            description="Receive text message notifications"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-[#E8F0FF]">
          <h4 className="font-bold text-[#1A1A1A] mb-3">Notification Types</h4>
          <div className="space-y-1">
            <ToggleSwitch
              isOn={notificationSettings.bookingUpdates}
              onToggle={() =>
                handleNotificationUpdate(
                  "bookingUpdates",
                  !notificationSettings.bookingUpdates,
                )
              }
              label="Booking Updates"
              description="Get notified about your bookings"
            />
            <ToggleSwitch
              isOn={notificationSettings.serviceReminders}
              onToggle={() =>
                handleNotificationUpdate(
                  "serviceReminders",
                  !notificationSettings.serviceReminders,
                )
              }
              label="Service Reminders"
              description="Reminders for upcoming services"
            />
            <ToggleSwitch
              isOn={notificationSettings.providerUpdates}
              onToggle={() =>
                handleNotificationUpdate(
                  "providerUpdates",
                  !notificationSettings.providerUpdates,
                )
              }
              label="Provider Updates"
              description="Updates from service providers"
            />
            <ToggleSwitch
              isOn={notificationSettings.newMessages}
              onToggle={() =>
                handleNotificationUpdate(
                  "newMessages",
                  !notificationSettings.newMessages,
                )
              }
              label="New Messages"
              description="Get notified when you receive new messages"
            />
            <ToggleSwitch
              isOn={notificationSettings.promotionalEmails}
              onToggle={() =>
                handleNotificationUpdate(
                  "promotionalEmails",
                  !notificationSettings.promotionalEmails,
                )
              }
              label="Promotional Emails"
              description="Receive promotional offers and updates"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render Danger Zone Tab
  const renderDangerZoneTab = () => (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Danger Zone</h2>
      <p className="text-gray-500 mb-6">Manage your account with caution</p>

      <div className="bg-white rounded-2xl border border-red-200 p-6 space-y-6">
        {/* Deactivate Account */}
        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div>
            <h3 className="font-bold text-[#1A1A1A]">Deactivate Account</h3>
            <p className="text-sm text-gray-500">
              Temporarily deactivate your account. You can reactivate anytime.
            </p>
          </div>
          <button
            onClick={handleDeactivateAccount}
            disabled={isLoading}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            Deactivate
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
          <div>
            <h3 className="font-bold text-[#1A1A1A]">Delete Account</h3>
            <p className="text-sm text-gray-500">
              Permanently delete your account and all data. This cannot be
              undone.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaTrash />
                Delete Account
              </>
            )}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-blue-500 text-xl mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-700">
                Account Security
              </p>
              <p className="text-xs text-blue-600 mt-1">
                For security reasons, you may be required to verify your
                identity before making changes to your account. All actions are
                logged and monitored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Settings Layout
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="pt-[72px] pb-12">
        <div className="max-w-[1280px] mx-auto px-5 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Settings</h1>
            <p className="text-gray-500">Manage your account preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-[#E8F0FF] pb-4">
            {[
              { id: "profile", label: "Profile", icon: FaUser },
              { id: "account", label: "Account", icon: FaUserCog },
              { id: "notifications", label: "Notifications", icon: FaBell },
              { id: "danger", label: "Danger Zone", icon: FaShieldAlt },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#0057FF] text-white shadow-lg shadow-blue-200"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={
                      activeTab === tab.id ? "text-white" : "text-gray-400"
                    }
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "account" && renderAccountTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "danger" && renderDangerZoneTab()}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Settings;
