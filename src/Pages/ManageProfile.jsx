// src/pages/ManageProfile.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { saveProviderServices } from "../services/services";
import Footer from "../components/Footer";
import { getCurrentUser, updateUserProfile } from "../services/services";
import { fetchCurrentUser } from "../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

function ManageProfile() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user, loading } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const dispatch = useDispatch();

  // Form states
  const [formData, setFormData] = useState({
    name: { full: "", display: "", first: "", last: "" },
    bio: "",
    category: "",
    secondaryCategories: [],
    service_area: "",
    service_radius_km: 25,
    experience_years: 0,
    hourly_rate: 0,
    base_price: 0,
    open_for_work: true,
    phone: "",
    email: "",
    street: "",
    area: "",
    gps_code: "",
    coordinates: { lat: "", lng: "" },
  });

  // Services state
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [gallery, setGallery] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Fetch user data
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await getCurrentUser();
  //       const userData = response.data;
  //       setData(userData);

  //       // Populate form data
  //       setFormData({
  //         name: userData.name || { full: "", display: "", first: "", last: "" },
  //         bio: userData.provider_profile?.bio || "",
  //         category: userData.provider_profile?.category || "",
  //         secondaryCategories:
  //           userData.provider_profile?.secondaryCategories || [],
  //         service_area: userData.provider_profile?.service_area || "",
  //         service_radius_km: userData.provider_profile?.service_radius_km || 25,
  //         experience_years: userData.provider_profile?.experience_years || 0,
  //         hourly_rate: userData.provider_profile?.hourly_rate || 0,
  //         base_price: userData.provider_profile?.base_price || 0,
  //         open_for_work: userData.provider_profile?.open_for_work !== false,
  //         phone: userData.phone || "",
  //         email: userData.email || "",
  //         street: userData.home_address?.street || "",
  //         area: userData.home_address?.area || "",
  //         gps_code: userData.home_address?.gps_code || "",
  //         coordinates: userData.home_address?.coordinates || {
  //           lat: "",
  //           lng: "",
  //         },
  //       });

  //       // Load services
  //       if (userData.services && userData.services.length > 0) {
  //         setServices(userData.services);
  //       } else {
  //         // Mock services for demo
  //         setServices([
  //           {
  //             id: "1",
  //             name: "Deep Cleaning",
  //             description:
  //               "Comprehensive deep cleaning for residential properties",
  //             price: 250,

  //             category: "Cleaning",

  //             createdAt: new Date().toISOString(),
  //           },
  //           {
  //             id: "2",
  //             name: "Plumbing Repair",
  //             description: "Expert plumbing repair and installation services",
  //             price: 75,

  //             category: "Plumbing",

  //             createdAt: new Date().toISOString(),
  //           },
  //         ]);
  //       }

  //       // Load gallery
  //       if (userData.gallery && userData.gallery.length > 0) {
  //         setGallery(userData.gallery);
  //       } else {
  //         setGallery([
  //           {
  //             _id: "1",
  //             title: "Modern Kitchen Renovation",
  //             category: "Kitchen",
  //             description: "Complete kitchen remodel with custom cabinets",
  //             url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
  //             image: {
  //               url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
  //             },
  //           },
  //           {
  //             _id: "2",
  //             title: "Bathroom Remodel",
  //             category: "Bathroom",
  //             description: "Luxury bathroom renovation",
  //             url: "https://images.unsplash.com/photo-1552321554-5fef8c9d4bf6?w=800&q=80",
  //             image: {
  //               url: "https://images.unsplash.com/photo-1552321554-5fef8c9d4bf6?w=800&q=80",
  //             },
  //           },
  //         ]);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching user:", err);
  //       setError("Failed to load profile data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle secondary categories
  const addCategory = () => {
    if (
      newCategory.trim() &&
      !formData.secondaryCategories.includes(newCategory.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        secondaryCategories: [...prev.secondaryCategories, newCategory.trim()],
      }));
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    setFormData((prev) => ({
      ...prev,
      secondaryCategories: prev.secondaryCategories.filter(
        (cat) => cat !== categoryToRemove,
      ),
    }));
  };

  // Handle service operations
  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",

        category: service.category || "",
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: "",
        description: "",
        price: "",
        category: "",
      });
    }
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
  };

  const handleServiceInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // UPDATED: Save service with API call
  const saveService = async () => {
    // Validation
    if (!serviceForm.name.trim()) {
      setError("Service name is required");
      return;
    }
    if (!serviceForm.price || parseFloat(serviceForm.price) <= 0) {
      setError("Valid price is required");
      return;
    }

    // Prepare service data
    const serviceData = {
      id: editingService?.id || `service-${Date.now()}`,
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      price: parseFloat(serviceForm.price),
      priceType: serviceForm.priceType,
      estimatedDuration: serviceForm.estimatedDuration,
      category: serviceForm.category.trim(),
      isActive: serviceForm.isActive,
      createdAt: editingService?.createdAt || new Date().toISOString(),
    };

    let updatedServices;
    if (editingService) {
      updatedServices = services.map((s) =>
        s.id === editingService.id ? serviceData : s,
      );
    } else {
      updatedServices = [...services, serviceData];
    }

    try {
      setSaving(true);

      // Call the API to save services
      const response = await saveProviderServices({
        services: updatedServices,
        providerId: data?._id,
      });

      // Update local state on success
      setServices(updatedServices);
      setSuccessMessage(
        editingService
          ? "Service updated successfully!"
          : "Service added successfully!",
      );

      // Reset form and close modal
      setTimeout(() => setSuccessMessage(null), 5000);
      closeServiceModal();
    } catch (err) {
      console.error("Error saving service:", err);
      setError(err.message || "Failed to save service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter((s) => s.id !== serviceId));
      setSuccessMessage("Service deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const toggleServiceStatus = (serviceId) => {
    setServices(
      services.map((s) =>
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s,
      ),
    );
  };

  // Handle gallery image upload
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      _id: `temp-${Date.now()}-${index}`,
      title: file.name.split(".")[0],
      category: "Uncategorized",
      description: "",
      url: URL.createObjectURL(file),
      image: { url: URL.createObjectURL(file) },
      file: file,
    }));

    setGallery((prev) => [...prev, ...newImages]);
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  };

  const updateGalleryItem = (id, field, value) => {
    setGallery((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const deleteGalleryItem = (id) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setGallery((prev) => prev.filter((item) => item._id !== id));
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const coverUrl = URL.createObjectURL(file);
      setData((prev) => ({
        ...prev,
        coverPicture: { url: coverUrl, updated_at: new Date() },
      }));
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const avatarUrl = URL.createObjectURL(file);
      setData((prev) => ({
        ...prev,
        avatar: { url: avatarUrl, updated_at: new Date() },
      }));
    }
  };

  // Save profile
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const updateData = {
        name: formData.name,
        provider_profile: {
          bio: formData.bio,
          category: formData.category,
          secondaryCategories: formData.secondaryCategories,
          service_area: formData.service_area,
          service_radius_km: formData.service_radius_km,
          experience_years: formData.experience_years,
          hourly_rate: formData.hourly_rate,
          base_price: formData.base_price,
          open_for_work: formData.open_for_work,
        },
        phone: formData.phone,
        email: formData.email,
        home_address: {
          street: formData.street,
          area: formData.area,
          gps_code: formData.gps_code,
          coordinates: formData.coordinates,
        },
        services: services,
        gallery: gallery,
      };

      await updateUserProfile(updateData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#F8FAFB] min-h-screen">
        <Navbar />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#E8F0FF] border-t-[#0057FF] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFB] min-h-screen">
      <Navbar />

      <div className="pt-[72px] pb-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">
                Manage Profile
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Update your profile information and manage your services
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/provider/${data?._id}`)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                View Profile
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-[#0057FF]/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fadeIn">
              <i className="fa-solid fa-check-circle text-green-500"></i>
              <span>{successMessage}</span>
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <i className="fa-solid fa-exclamation-circle text-red-500"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
              {[
                { id: "profile", label: "Profile Info", icon: "fa-user" },
                { id: "services", label: "Services", icon: "fa-briefcase" },
                { id: "gallery", label: "Work Gallery", icon: "fa-images" },
                { id: "settings", label: "Settings", icon: "fa-gear" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap capitalize transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-[#0057FF] text-[#0057FF] bg-[#F5F8FF]"
                      : "border-transparent text-gray-500 hover:text-[#0057FF] hover:bg-gray-50"
                  }`}
                >
                  <i className={`fa-solid ${tab.icon}`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {/* Profile Info Tab */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  {/* Profile Photo & Cover */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#1A1A1A]">
                      Profile Photos
                    </h2>
                    <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-gray-100">
                      <img
                        src={
                          user?.coverPicture?.url ||
                          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
                        }
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white transition-colors flex items-center gap-2">
                          <i className="fa-solid fa-camera"></i>
                          <span className="text-sm font-medium">
                            Change Cover
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverUpload}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                        <img
                          src={
                            user?.avatar?.url ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                          }
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <label className="cursor-pointer w-full h-full flex items-center justify-center">
                            <i className="fa-solid fa-camera text-white text-xl"></i>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarUpload}
                            />
                          </label>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">
                          Profile Photo
                        </p>
                        <p className="text-xs text-gray-400">
                          JPG, PNG or GIF. Max 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#1A1A1A]">
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name.full"
                          value={formData.name?.full || user?.name?.full || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          name="name.display"
                          value={
                            formData.name?.display || user?.name?.display || ""
                          }
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          placeholder="How you want to be displayed"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone || user?.phone || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          disabled
                          type="email"
                          name="email"
                          value={formData.email || user?.email || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Provider Profile */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#1A1A1A]">
                      Provider Profile
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={
                          formData.bio || user?.provider_profile?.bio || ""
                        }
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors resize-none"
                        placeholder="Tell customers about yourself and your services..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={
                            formData.category ||
                            user?.provider_profile?.category ||
                            ""
                          }
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          placeholder="e.g., Cleaning, Plumbing, Electrical"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Area
                        </label>
                        <input
                          type="text"
                          name="service_area"
                          value={
                            formData.service_area ||
                            user?.provider_profile?.service_area ||
                            ""
                          }
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          placeholder="e.g., East Legon, Accra"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Years Experience
                        </label>
                        <input
                          type="number"
                          name="experience_years"
                          value={
                            formData.experience_years ||
                            user?.provider_profile?.experience_years ||
                            0
                          }
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Radius (km)
                        </label>
                        <input
                          type="number"
                          name="service_radius_km"
                          value={
                            formData.service_radius_km ||
                            user?.provider_profile?.service_radius_km ||
                            25
                          }
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Base Price (GH₵)
                        </label>
                        <input
                          type="number"
                          name="base_price"
                          value={
                            formData.base_price ||
                            user?.provider_profile?.base_price ||
                            0
                          }
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hourly Rate (GH₵)
                        </label>
                        <input
                          type="number"
                          name="hourly_rate"
                          value={
                            formData.hourly_rate ||
                            user?.provider_profile?.hourly_rate ||
                            0
                          }
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="open_for_work"
                            checked={
                              formData.open_for_work !== undefined
                                ? formData.open_for_work
                                : user?.provider_profile?.open_for_work !==
                                  false
                            }
                            onChange={handleInputChange}
                            className="w-5 h-5 text-[#0057FF] border-gray-300 rounded focus:ring-[#0057FF]"
                          />
                          <span className="text-sm text-gray-700">
                            Open for Work
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Secondary Categories */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Categories
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addCategory()}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          placeholder="Add a category (e.g., Residential, Commercial)"
                        />
                        <button
                          onClick={addCategory}
                          className="px-4 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.secondaryCategories?.length > 0
                          ? formData.secondaryCategories
                          : user?.provider_profile?.secondaryCategories || []
                        ).map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 bg-[#F5F8FF] text-[#0057FF] px-3 py-1.5 rounded-lg text-sm border border-[#E8F0FF]"
                          >
                            {category}
                            <button
                              onClick={() => removeCategory(category)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <i className="fa-solid fa-times"></i>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Location Information */}
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                      <h3 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                        <i className="fa-solid fa-location-dot text-[#0057FF]"></i>
                        Location Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={
                              formData.street ||
                              user?.home_address?.street ||
                              ""
                            }
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                            placeholder="Street address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area
                          </label>
                          <input
                            type="text"
                            name="area"
                            value={
                              formData.area || user?.home_address?.area || ""
                            }
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                            placeholder="Area or neighborhood"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            GPS Code
                          </label>
                          <input
                            type="text"
                            name="gps_code"
                            value={
                              formData.gps_code ||
                              user?.home_address?.gps_code ||
                              ""
                            }
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                            placeholder="GPS code"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#1A1A1A]">
                        Your Services
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage the services you offer to customers
                      </p>
                    </div>
                    <button
                      onClick={() => openServiceModal()}
                      className="px-4 py-2 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-[#0057FF]/25"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Add Service</span>
                    </button>
                  </div>

                  {/* Services List */}
                  {services.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-briefcase text-3xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                        No Services Added Yet
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Add your first service to start attracting customers
                      </p>
                      <button
                        onClick={() => openServiceModal()}
                        className="px-6 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                      >
                        <i className="fa-solid fa-plus"></i>
                        Add Your First Service
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <div
                          key={service.id || service._id}
                          className={`bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${
                            service.isActive || service.is_active
                              ? "border-[#E8F0FF]"
                              : "border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-[#1A1A1A]">
                                  {service.name}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    service.isActive || service.is_active
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {service.isActive || service.is_active
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                {service.description ||
                                  "No description provided"}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <i className="fa-solid fa-tag text-[#0057FF]"></i>
                                  {service.category || "Uncategorized"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <i className="fa-solid fa-clock text-[#0057FF]"></i>
                                  {service.estimatedDuration || "N/A"}
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-[#0057FF]">
                                  GH₵ {service.price}
                                  {service.priceType === "hourly" && "/hr"}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 ml-4">
                              <button
                                onClick={() => openServiceModal(service)}
                                className="w-8 h-8 rounded-lg bg-blue-50 text-[#0057FF] hover:bg-blue-100 transition-colors flex items-center justify-center"
                              >
                                <i className="fa-solid fa-pen text-sm"></i>
                              </button>
                              <button
                                onClick={() =>
                                  toggleServiceStatus(service.id || service._id)
                                }
                                className={`w-8 h-8 rounded-lg transition-colors flex items-center justify-center ${
                                  service.isActive || service.is_active
                                    ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                                }`}
                              >
                                <i
                                  className={`fa-solid ${service.isActive || service.is_active ? "fa-pause" : "fa-play"} text-sm`}
                                ></i>
                              </button>
                              <button
                                onClick={() =>
                                  deleteService(service.id || service._id)
                                }
                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
                              >
                                <i className="fa-solid fa-trash text-sm"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Service Stats */}
                  {services.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#1A1A1A]">
                          {services.length}
                        </p>
                        <p className="text-xs text-gray-500">Total Services</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">
                          {
                            services.filter((s) => s.isActive || s.is_active)
                              .length
                          }
                        </p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-400">
                          {
                            services.filter((s) => !(s.isActive || s.is_active))
                              .length
                          }
                        </p>
                        <p className="text-xs text-gray-500">Inactive</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#0057FF]">
                          GH₵{" "}
                          {services
                            .reduce((sum, s) => sum + (s.price || 0), 0)
                            .toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Total Value</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Work Gallery Tab */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#1A1A1A]">
                        Work Gallery
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Showcase your best work to attract more customers
                      </p>
                    </div>
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      className="px-4 py-2 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-[#0057FF]/25"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Add Images</span>
                    </button>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                  </div>

                  {gallery.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-regular fa-images text-3xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                        No Work Samples Yet
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Upload photos of your work to showcase your skills
                      </p>
                      <button
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-6 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                      >
                        <i className="fa-solid fa-cloud-upload-alt"></i>
                        Upload Images
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.map((item) => (
                        <div
                          key={item._id || item.id}
                          className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-transparent hover:border-[#0057FF] transition-all"
                        >
                          <img
                            src={item.image?.url || item.url}
                            alt={item.title || "Work sample"}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedImage(item);
                                setIsLightboxOpen(true);
                              }}
                              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <i className="fa-solid fa-eye text-gray-700 text-sm"></i>
                            </button>
                            <button
                              onClick={() =>
                                deleteGalleryItem(item._id || item.id)
                              }
                              className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <i className="fa-solid fa-trash text-white text-sm"></i>
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-3">
                            <input
                              type="text"
                              value={item.title || ""}
                              onChange={(e) =>
                                updateGalleryItem(
                                  item._id || item.id,
                                  "title",
                                  e.target.value,
                                )
                              }
                              placeholder="Add title"
                              className="w-full bg-transparent text-white text-sm font-medium placeholder:text-white/50 focus:outline-none border-b border-white/20 focus:border-white/50 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <input
                              type="text"
                              value={item.category || ""}
                              onChange={(e) =>
                                updateGalleryItem(
                                  item._id || item.id,
                                  "category",
                                  e.target.value,
                                )
                              }
                              placeholder="Add category"
                              className="w-full bg-transparent text-white/70 text-xs placeholder:text-white/40 focus:outline-none border-b border-white/10 focus:border-white/30 transition-colors mt-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                      Account Settings
                    </h2>
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                      <h3 className="font-semibold text-[#1A1A1A] mb-3">
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-gray-700">
                            SMS Notifications
                          </span>
                          <input
                            type="checkbox"
                            defaultChecked={
                              user?.preferences?.notifications?.sms !== false
                            }
                            className="w-5 h-5 text-[#0057FF] border-gray-300 rounded focus:ring-[#0057FF]"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-gray-700">
                            Email Notifications
                          </span>
                          <input
                            type="checkbox"
                            defaultChecked={
                              user?.preferences?.notifications?.email !== false
                            }
                            className="w-5 h-5 text-[#0057FF] border-gray-300 rounded focus:ring-[#0057FF]"
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-gray-700">
                            Push Notifications
                          </span>
                          <input
                            type="checkbox"
                            defaultChecked={
                              user?.preferences?.notifications?.push !== false
                            }
                            className="w-5 h-5 text-[#0057FF] border-gray-300 rounded focus:ring-[#0057FF]"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                      <h3 className="font-semibold text-[#1A1A1A] mb-3">
                        Language
                      </h3>
                      <select
                        defaultValue={user?.preferences?.language || "en"}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors bg-white"
                      >
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                    <div className="border-2 border-red-200 rounded-2xl p-6">
                      <h3 className="font-semibold text-red-600 mb-2">
                        Danger Zone
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Once you delete your account, there is no going back.
                      </p>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeServiceModal}
          />
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl p-6 md:p-8 animate-fadeIn">
              <button
                onClick={closeServiceModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#1A1A1A]">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingService
                    ? "Update your service details"
                    : "Create a new service to offer to customers"}
                </p>
              </div>

              <div className="space-y-4">
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={serviceForm.name}
                    onChange={handleServiceInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                    placeholder="e.g., Deep Cleaning, Plumbing Repair"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={serviceForm.description}
                    onChange={handleServiceInputChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors resize-none"
                    placeholder="Describe what this service includes..."
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={serviceForm.category}
                      onChange={handleServiceInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors appearance-none bg-white pr-10"
                    >
                      <option value="">Select a category</option>
                      <option value="Cleaning">🧹 Cleaning</option>
                      <option value="Plumbing">🔧 Plumbing</option>
                      <option value="Electrical">⚡ Electrical</option>
                      <option value="Carpentry">🪚 Carpentry</option>
                      <option value="Painting">🎨 Painting</option>
                      <option value="Gardening">🌿 Gardening</option>
                      <option value="Pest Control">🐜 Pest Control</option>
                      <option value="Appliance Repair">
                        🔌 Appliance Repair
                      </option>
                      <option value="HVAC">❄️ HVAC</option>
                      <option value="Roofing">🏠 Roofing</option>
                      <option value="Flooring">🪵 Flooring</option>
                      <option value="Tiling">🧱 Tiling</option>
                      <option value="Landscaping">🌳 Landscaping</option>
                      <option value="Pool Maintenance">
                        🏊 Pool Maintenance
                      </option>
                      <option value="Security Systems">
                        🔒 Security Systems
                      </option>
                      <option value="Smart Home">🏠 Smart Home</option>
                      <option value="Interior Design">
                        🛋️ Interior Design
                      </option>
                      <option value="Event Planning">🎉 Event Planning</option>
                      <option value="Catering">🍽️ Catering</option>
                      <option value="Photography">📸 Photography</option>
                      <option value="IT Services">💻 IT Services</option>
                      <option value="Web Development">
                        🌐 Web Development
                      </option>
                      <option value="Mobile App Development">
                        📱 App Development
                      </option>
                      <option value="Digital Marketing">
                        📢 Digital Marketing
                      </option>
                      <option value="Content Writing">
                        ✍️ Content Writing
                      </option>
                      <option value="Graphic Design">🎨 Graphic Design</option>
                      <option value="Video Editing">🎬 Video Editing</option>
                      <option value="Music Lessons">🎵 Music Lessons</option>
                      <option value="Tutoring">📚 Tutoring</option>
                      <option value="Fitness Training">
                        💪 Fitness Training
                      </option>
                      <option value="Massage Therapy">
                        💆 Massage Therapy
                      </option>
                      <option value="Hair & Beauty">💇 Hair & Beauty</option>
                      <option value="Mobile Car Wash">
                        🚗 Mobile Car Wash
                      </option>
                      <option value="Auto Repair">🔧 Auto Repair</option>
                      <option value="Glass Repair">🪟 Glass Repair</option>
                      <option value="Locksmith">🔐 Locksmith</option>
                      <option value="Handyman">🔨 Handyman</option>
                      <option value="Moving Services">
                        🚚 Moving Services
                      </option>
                      <option value="Junk Removal">🗑️ Junk Removal</option>
                      <option value="Other">📌 Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <i className="fa-solid fa-chevron-down text-gray-400 text-sm"></i>
                    </div>
                  </div>
                  {serviceForm.category && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected:{" "}
                      <span className="font-medium text-[#0057FF]">
                        {serviceForm.category}
                      </span>
                    </p>
                  )}
                </div>

                {/* Price and Pricing Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (GH₵) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                        GH₵
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={serviceForm.price}
                        onChange={handleServiceInputChange}
                        className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pricing Type
                    </label>
                    <select
                      name="priceType"
                      value={serviceForm.priceType}
                      onChange={handleServiceInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors appearance-none bg-white"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="hourly">Hourly Rate</option>
                      <option value="daily">Daily Rate</option>
                      <option value="weekly">Weekly Rate</option>
                      <option value="monthly">Monthly Rate</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                  </div>
                </div>

                {/* Estimated Duration */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration
                  </label>
                  <select
                    name="estimatedDuration"
                    value={serviceForm.estimatedDuration}
                    onChange={handleServiceInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors appearance-none bg-white"
                  >
                    <option value="">Select duration</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                    <option value="4 hours">4 hours</option>
                    <option value="5 hours">5 hours</option>
                    <option value="6 hours">6 hours</option>
                    <option value="8 hours">8 hours (Full day)</option>
                    <option value="1-2 days">1-2 days</option>
                    <option value="3-5 days">3-5 days</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="Custom">Custom duration</option>
                  </select>
                </div> */}

                {/* Custom Duration Input (shown when Custom is selected) */}
                {serviceForm.estimatedDuration === "Custom" && (
                  <div className="animate-fadeIn">
                    <input
                      type="text"
                      name="customDuration"
                      value={serviceForm.customDuration || ""}
                      onChange={(e) => {
                        setServiceForm((prev) => ({
                          ...prev,
                          customDuration: e.target.value,
                          estimatedDuration: e.target.value || "Custom",
                        }));
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                      placeholder="Enter custom duration (e.g., 2-3 hours)"
                    />
                  </div>
                )}

                {/* Service Active Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={serviceForm.isActive}
                      onChange={handleServiceInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0057FF]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0057FF]"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">
                      Service is {serviceForm.isActive ? "active" : "inactive"}
                    </span>
                  </label>
                </div>

                {/* Additional Options */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <details className="group">
                    <summary className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-[#0057FF] transition-colors">
                      <i className="fa-solid fa-chevron-right group-open:rotate-90 transition-transform"></i>
                      Advanced Options
                    </summary>
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Tags
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={serviceForm.tags || ""}
                          onChange={handleServiceInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          placeholder="e.g., premium, emergency, eco-friendly"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Separate tags with commas
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Image URL
                        </label>
                        <input
                          type="text"
                          name="imageUrl"
                          value={serviceForm.imageUrl || ""}
                          onChange={handleServiceInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-colors"
                          placeholder="https://example.com/service-image.jpg"
                        />
                      </div>
                    </div>
                  </details>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={closeServiceModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveService}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg shadow-[#0057FF]/25 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      {editingService ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <i
                        className={`fa-solid ${editingService ? "fa-pen" : "fa-plus"}`}
                      ></i>
                      {editingService ? "Update Service" : "Add Service"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setIsLightboxOpen(false);
            setSelectedImage(null);
          }}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors text-2xl"
              onClick={() => {
                setIsLightboxOpen(false);
                setSelectedImage(null);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="bg-white rounded-2xl overflow-hidden">
              <img
                src={selectedImage.image?.url || selectedImage.url}
                alt={selectedImage.title || "Work sample"}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-4 bg-white">
                <h3 className="font-bold text-[#1A1A1A] text-lg">
                  {selectedImage.title || "Untitled"}
                </h3>
                <p className="text-sm text-[#0057FF] font-medium">
                  {selectedImage.category || "Uncategorized"}
                </p>
                {selectedImage.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default ManageProfile;
