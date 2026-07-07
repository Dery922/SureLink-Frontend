// src/pages/ManageProfile.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchCurrentUser } from "../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import NavbarDashbaord from "../components/NavbarDashboard";
import { createPortal } from "react-dom"; // Add this import
import toast from "react-hot-toast";
import ConfirmationModal from "../components/ConfirmationModel";
import {
  getGalleryImagesByUserId,
  getServiceId,
  saveProviderServices,
  getCurrentUser,
  updateUserProfile,
  saveGallery,
  getProviderServices,
  getGalleryImages, // Keep this if needed elsewhere
  deleteGalleryImage,
  updateGalleryImage,
} from "../services/services";

function ManageProfile() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const galleryInputRef = useRef(null);
  const [newCategory, setNewCategory] = useState("");
  // Add this state at the top of your component
  const [categorySearch, setCategorySearch] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);
  // Services state
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

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

  const userPrimaryCategory =
    user?.provider_profile?.category || user?.category || "";

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    category: userPrimaryCategory || "", // This comes from Redux
    categorySearch: userPrimaryCategory || "", // For display
    serviceTypes: [],
    price: "",
    priceType: "fixed",
    pricingModel: "package",
    basePrice: "",
    individualPrices: {},
    isActive: true,
    tags: "",
    imageUrl: "",
  });

  // Add this state
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const SERVICE_TYPES_CONFIG = {
    Plumbing: [
      {
        value: "pipe_repair",
        label: "Pipe Repair",
        icon: "🔧",
        description: "Fix leaking or broken pipes",
      },
      {
        value: "installation",
        label: "Installation",
        icon: "🔩",
        description: "Install new plumbing fixtures",
      },
      {
        value: "drainage",
        label: "Drainage",
        icon: "💧",
        description: "Clear and repair drains",
      },
      {
        value: "leak_detection",
        label: "Leak Detection",
        icon: "🔍",
        description: "Find and fix hidden leaks",
      },
      {
        value: "water_heater",
        label: "Water Heater Repair",
        icon: "🔥",
        description: "Repair or replace water heaters",
      },
      {
        value: "bathroom_repair",
        label: "Bathroom Repair",
        icon: "🚿",
        description: "Fix bathroom fixtures",
      },
      {
        value: "kitchen_plumbing",
        label: "Kitchen Plumbing",
        icon: "🍽️",
        description: "Kitchen sink and appliance plumbing",
      },
      {
        value: "pipe_insulation",
        label: "Pipe Insulation",
        icon: "🧊",
        description: "Insulate pipes to prevent freezing",
      },
      {
        value: "emergency_plumbing",
        label: "Emergency Plumbing",
        icon: "🚨",
        description: "24/7 emergency plumbing services",
      },
    ],
    Cleaning: [
      {
        value: "deep_cleaning",
        label: "Deep Cleaning",
        icon: "🧹",
        description: "Thorough deep cleaning service",
      },
      {
        value: "carpet_cleaning",
        label: "Carpet Cleaning",
        icon: "🧽",
        description: "Professional carpet cleaning",
      },
      {
        value: "window_cleaning",
        label: "Window Cleaning",
        icon: "🪟",
        description: "Interior and exterior window cleaning",
      },
      {
        value: "move_in_out",
        label: "Move In/Out Cleaning",
        icon: "🏠",
        description: "Cleaning for moving in or out",
      },
      {
        value: "commercial",
        label: "Commercial Cleaning",
        icon: "🏢",
        description: "Office and business cleaning",
      },
      {
        value: "residential",
        label: "Residential Cleaning",
        icon: "🏡",
        description: "Regular home cleaning",
      },
      {
        value: "post_construction",
        label: "Post-Construction",
        icon: "🏗️",
        description: "Cleanup after construction",
      },
      {
        value: "green_cleaning",
        label: "Eco-Friendly Cleaning",
        icon: "🌱",
        description: "Environmentally friendly cleaning",
      },
    ],
    Electrical: [
      {
        value: "wiring",
        label: "Wiring Installation",
        icon: "⚡",
        description: "Install new electrical wiring",
      },
      {
        value: "lighting",
        label: "Lighting Installation",
        icon: "💡",
        description: "Install lighting fixtures",
      },
      {
        value: "panel_upgrade",
        label: "Panel Upgrade",
        icon: "🔌",
        description: "Upgrade electrical panels",
      },
      {
        value: "outlet_repair",
        label: "Outlet Repair",
        icon: "🔌",
        description: "Fix or replace outlets",
      },
      {
        value: "ceiling_fan",
        label: "Ceiling Fan Installation",
        icon: "🌀",
        description: "Install ceiling fans",
      },
      {
        value: "smart_home",
        label: "Smart Home Setup",
        icon: "🏠",
        description: "Install smart home devices",
      },
      {
        value: "security_systems",
        label: "Security Systems",
        icon: "🔒",
        description: "Install security systems",
      },
      {
        value: "emergency_electrical",
        label: "Emergency Electrical",
        icon: "🚨",
        description: "Emergency electrical repairs",
      },
      {
        value: "home_automation",
        label: "Home Automation",
        icon: "🤖",
        description: "Automate your home systems",
      },
    ],
    Carpentry: [
      {
        value: "furniture_making",
        label: "Furniture Making",
        icon: "🪑",
        description: "Custom furniture creation",
      },
      {
        value: "cabinet_installation",
        label: "Cabinet Installation",
        icon: "🗄️",
        description: "Install kitchen and bathroom cabinets",
      },
      {
        value: "door_repair",
        label: "Door Repair",
        icon: "🚪",
        description: "Fix or replace doors",
      },
      {
        value: "window_repair",
        label: "Window Repair",
        icon: "🪟",
        description: "Fix windows and frames",
      },
      {
        value: "deck_building",
        label: "Deck Building",
        icon: "🪵",
        description: "Build outdoor decks",
      },
      {
        value: "wood_flooring",
        label: "Wood Flooring",
        icon: "🪵",
        description: "Install or repair wood floors",
      },
      {
        value: "custom_woodwork",
        label: "Custom Woodwork",
        icon: "🪚",
        description: "Custom wood projects",
      },
      {
        value: "furniture_repair",
        label: "Furniture Repair",
        icon: "🔨",
        description: "Restore and repair furniture",
      },
    ],
    Painting: [
      {
        value: "interior_painting",
        label: "Interior Painting",
        icon: "🎨",
        description: "Paint interior walls and ceilings",
      },
      {
        value: "exterior_painting",
        label: "Exterior Painting",
        icon: "🏠",
        description: "Paint exterior surfaces",
      },
      {
        value: "wallpaper_installation",
        label: "Wallpaper Installation",
        icon: "📄",
        description: "Install wallpaper",
      },
      {
        value: "deck_staining",
        label: "Deck Staining",
        icon: "🪵",
        description: "Stain and seal decks",
      },
      {
        value: "cabinet_painting",
        label: "Cabinet Painting",
        icon: "🗄️",
        description: "Paint kitchen and bathroom cabinets",
      },
      {
        value: "fence_painting",
        label: "Fence Painting",
        icon: "🚧",
        description: "Paint or stain fences",
      },
      {
        value: "commercial_painting",
        label: "Commercial Painting",
        icon: "🏢",
        description: "Commercial building painting",
      },
    ],
    Gardening: [
      {
        value: "landscaping",
        label: "Landscaping",
        icon: "🌳",
        description: "Design and install landscapes",
      },
      {
        value: "lawn_care",
        label: "Lawn Care",
        icon: "🌿",
        description: "Mowing, fertilizing, and lawn maintenance",
      },
      {
        value: "tree_trimming",
        label: "Tree Trimming",
        icon: "🌳",
        description: "Trim and prune trees",
      },
      {
        value: "garden_design",
        label: "Garden Design",
        icon: "🌸",
        description: "Design and plant gardens",
      },
      {
        value: "irrigation",
        label: "Irrigation",
        icon: "💧",
        description: "Install irrigation systems",
      },
      {
        value: "hardscaping",
        label: "Hardscaping",
        icon: "🪨",
        description: "Install patios, walkways, and stonework",
      },
      {
        value: "seasonal_cleanup",
        label: "Seasonal Cleanup",
        icon: "🍂",
        description: "Spring and fall cleanup",
      },
      {
        value: "garden_maintenance",
        label: "Garden Maintenance",
        icon: "🌱",
        description: "Ongoing garden care",
      },
    ],
    // Add more categories as needed
  };

  const CATEGORIES = [
    { value: "Cleaning", label: "Cleaning", icon: "🧹" },
    { value: "Plumbing", label: "Plumbing", icon: "🔧" },
    { value: "Electrical", label: "Electrical", icon: "⚡" },
    { value: "Carpentry", label: "Carpentry", icon: "🪚" },
    { value: "Painting", label: "Painting", icon: "🎨" },
    { value: "Gardening", label: "Gardening", icon: "🌿" },
    { value: "Pest Control", label: "Pest Control", icon: "🐜" },
    { value: "Appliance Repair", label: "Appliance Repair", icon: "🔌" },
    { value: "HVAC", label: "HVAC", icon: "❄️" },
    { value: "Roofing", label: "Roofing", icon: "🏠" },
    { value: "Flooring", label: "Flooring", icon: "🪵" },
    { value: "Tiling", label: "Tiling", icon: "🧱" },
    { value: "Landscaping", label: "Landscaping", icon: "🌳" },
    { value: "Pool Maintenance", label: "Pool Maintenance", icon: "🏊" },
    { value: "Security Systems", label: "Security Systems", icon: "🔒" },
    { value: "Smart Home", label: "Smart Home", icon: "🏠" },
    { value: "Interior Design", label: "Interior Design", icon: "🛋️" },
    { value: "Event Planning", label: "Event Planning", icon: "🎉" },
    { value: "Catering", label: "Catering", icon: "🍽️" },
    { value: "Photography", label: "Photography", icon: "📸" },
    { value: "IT Services", label: "IT Services", icon: "💻" },
    { value: "Web Development", label: "Web Development", icon: "🌐" },
    {
      value: "Mobile App Development",
      label: "Mobile App Development",
      icon: "📱",
    },
    { value: "Digital Marketing", label: "Digital Marketing", icon: "📢" },
    { value: "Content Writing", label: "Content Writing", icon: "✍️" },
    { value: "Graphic Design", label: "Graphic Design", icon: "🎨" },
    { value: "Video Editing", label: "Video Editing", icon: "🎬" },
    { value: "Music Lessons", label: "Music Lessons", icon: "🎵" },
    { value: "Tutoring", label: "Tutoring", icon: "📚" },
    { value: "Fitness Training", label: "Fitness Training", icon: "💪" },
    { value: "Massage Therapy", label: "Massage Therapy", icon: "💆" },
    { value: "Hair & Beauty", label: "Hair & Beauty", icon: "💇" },
    { value: "Mobile Car Wash", label: "Mobile Car Wash", icon: "🚗" },
    { value: "Auto Repair", label: "Auto Repair", icon: "🔧" },
    { value: "Glass Repair", label: "Glass Repair", icon: "🪟" },
    { value: "Locksmith", label: "Locksmith", icon: "🔐" },
    { value: "Handyman", label: "Handyman", icon: "🔨" },
    { value: "Moving Services", label: "Moving Services", icon: "🚚" },
    { value: "Junk Removal", label: "Junk Removal", icon: "🗑️" },
    { value: "Other", label: "Other", icon: "📌" },
  ];

  const getAvailableCategories = () => {
    if (!userPrimaryCategory) return CATEGORIES;

    // If user is a provider, only show their primary category
    return CATEGORIES.filter((cat) => cat.value === userPrimaryCategory);
  };

  // // Helper function to get service types for a category
  const getServiceTypesForCategory = (category) => {
    return SERVICE_TYPES_CONFIG[category] || [];
  };

  useEffect(() => {
    console.log("categorySearch:", categorySearch);
  }, [categorySearch]);

  // Update handler
  const handleServiceInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Update position function
  const updateDropdownPosition = () => {
    if (categoryRef.current) {
      const rect = categoryRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  // Update position when opening dropdown
  useEffect(() => {
    if (isCategoryOpen) {
      updateDropdownPosition();

      // Update position on scroll or resize
      const handleUpdate = () => updateDropdownPosition();
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);

      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }, [isCategoryOpen]);
  // Fetch services from backend

  // Fetch current user's services from backend
  // In your component

  // Also update when categoryRef changes
  useEffect(() => {
    if (categoryRef.current && isCategoryOpen) {
      updateDropdownPosition();
    }
  }, [categoryRef.current, isCategoryOpen]);
  // Filter categories based on search
  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.label.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  // Fetch user data
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
  // const openServiceModal = (service = null) => {
  //   if (service) {
  //     setEditingService(service);
  //     setServiceForm({
  //       name: service.name || "",
  //       description: service.description || "",
  //       price: service.price || "",
  //       category: service.category || "",
  //     });
  //   } else {
  //     setEditingService(null);
  //     setServiceForm({
  //       name: "",
  //       description: "",
  //       price: "",
  //       category: "",
  //     });
  //   }
  //   setShowServiceModal(true);
  // };

  // In ManageProfile.jsx - Fix the serviceForm initialization

  // Get user's primary category from Redux

  // When opening the modal for editing
  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name || "",
        description: service.description || "",
        category: service.category || userPrimaryCategory || "", // Use Redux category as fallback
        categorySearch: service.category || userPrimaryCategory || "",
        serviceTypes: service.serviceTypes || [],
        price: service.price || service.basePrice || "",
        priceType: service.priceType || "fixed",
        pricingModel: service.pricingModel || "package",
        basePrice: service.basePrice || service.price || "",
        individualPrices: service.individualPrices || {},
        isActive: service.is_active !== false,
        tags: service.tags ? service.tags.join(", ") : "",
        imageUrl: service.imageUrl || "",
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: "",
        description: "",
        category: userPrimaryCategory || "", // Always use Redux category
        categorySearch: userPrimaryCategory || "",
        serviceTypes: [],
        price: "",
        priceType: "fixed",
        pricingModel: "package",
        basePrice: "",
        individualPrices: {},
        isActive: true,
        tags: "",
        imageUrl: "",
      });
    }
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
  };

  // Save service with API call
  // const saveService = async () => {
  //   // Validation
  //   if (!serviceForm.name.trim()) {
  //     toast.error("Service name is required");
  //     return;
  //   }
  //   if (!serviceForm.price || parseFloat(serviceForm.price) <= 0) {
  //     toast.error("Valid price is required");
  //     return;
  //   }

  //   // Prepare service data
  //   const serviceData = {
  //     id: editingService?.id || `service-${Date.now()}`,
  //     name: serviceForm.name.trim(),
  //     description: serviceForm.description.trim(),
  //     price: parseFloat(serviceForm.price),
  //     priceType: serviceForm.priceType || "fixed",
  //     category: serviceForm.category.trim(),
  //     // ✅ FIX: Use the correct field name from the form
  //     is_active:
  //       serviceForm.isActive !== undefined ? serviceForm.isActive : true,
  //     createdAt: editingService?.createdAt || new Date().toISOString(),
  //   };

  //   let updatedServices;
  //   if (editingService) {
  //     const serviceId = editingService.id || editingService._id;
  //     updatedServices = services.map((s) => {
  //       const sId = s.id || s._id;
  //       return sId === serviceId ? serviceData : s;
  //     });
  //   } else {
  //     updatedServices = [...services, serviceData];
  //   }

  //   try {
  //     setSaving(true);

  //     // Call the API to save services
  //     const response = await saveProviderServices({
  //       services: updatedServices,
  //       providerId: user?._id, // Use user._id instead of data?._id
  //     });

  //     // Update local state on success
  //     setServices(updatedServices);

  //     toast.success(
  //       editingService
  //         ? "Service updated successfully!"
  //         : "Service added successfully!",
  //     );

  //     closeServiceModal();
  //   } catch (err) {
  //     console.error("Error saving service:", err);
  //     toast.error(err.message || "Failed to save service. Please try again.");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // Save service with API call - FIXED to use Redux category
  const saveService = async () => {
    // Validation
    if (!serviceForm.name.trim()) {
      toast.error("Service name is required");
      return;
    }

    // ✅ Use the category from Redux (userPrimaryCategory)
    // If serviceForm.category is empty, fallback to userPrimaryCategory
    const categoryToUse = serviceForm.category || userPrimaryCategory;

    if (!categoryToUse || categoryToUse.trim() === "") {
      toast.error("Please set your primary category in your profile first");
      return;
    }

    // Validate based on pricing model
    let priceValue = 0;
    if (serviceForm.pricingModel === "package") {
      const basePrice = parseFloat(serviceForm.basePrice || serviceForm.price);
      if (!basePrice || basePrice <= 0) {
        toast.error("Valid base price is required");
        return;
      }
      priceValue = basePrice;
    } else if (serviceForm.pricingModel === "individual") {
      if (!serviceForm.serviceTypes || serviceForm.serviceTypes.length === 0) {
        toast.error("Please select at least one service type");
        return;
      }
      // Check if all service types have prices
      const missingPrices = serviceForm.serviceTypes.filter(
        (type) =>
          !serviceForm.individualPrices?.[type] ||
          serviceForm.individualPrices[type] <= 0,
      );
      if (missingPrices.length > 0) {
        toast.error(`Missing prices for: ${missingPrices.join(", ")}`);
        return;
      }
      priceValue = 0;
    }

    // Prepare service data - ✅ Use category from Redux
    const serviceData = {
      _id: editingService?._id || editingService?.id || `service-${Date.now()}`,
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      category: categoryToUse, // ✅ This is now from Redux
      serviceTypes: serviceForm.serviceTypes || [],
      pricingModel: serviceForm.pricingModel || "package",
      priceType: serviceForm.priceType || "fixed",
      isActive: serviceForm.isActive !== false,
      tags: serviceForm.tags || "",
      imageUrl: serviceForm.imageUrl || "",
    };

    // Add pricing based on model
    if (serviceForm.pricingModel === "package") {
      serviceData.basePrice = parseFloat(
        serviceForm.basePrice || serviceForm.price || 0,
      );
      serviceData.price = parseFloat(
        serviceForm.basePrice || serviceForm.price || 0,
      );
    } else if (serviceForm.pricingModel === "individual") {
      serviceData.individualPrices = serviceForm.individualPrices || {};
      serviceData.price = 0;
    }

    console.log("📦 Saving service with category:", categoryToUse); // Debug log
    console.log("📦 Service data:", serviceData);

    let updatedServices;
    if (editingService) {
      const serviceId = editingService._id || editingService.id;
      updatedServices = services.map((s) => {
        const sId = s._id || s.id;
        return sId === serviceId ? { ...s, ...serviceData } : s;
      });
    } else {
      updatedServices = [...services, serviceData];
    }

    try {
      setSaving(true);

      const response = await saveProviderServices({
        services: updatedServices,
        providerId: user?._id || user?.id,
      });

      if (response.success) {
        setServices(response.data?.services || updatedServices);

        toast.success(
          editingService
            ? "Service updated successfully!"
            : "Service added successfully!",
        );
        closeServiceModal();
      } else {
        throw new Error(response.message || "Failed to save service");
      }
    } catch (err) {
      console.error("Error saving service:", err);
      toast.error(err.message || "Failed to save service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchUserServices = async () => {
      try {
        // Check if user exists
        if (!user?._id) {
          console.log("⏳ Waiting for user data...");
          return;
        }

        console.log("🔍 Fetching services for provider:", user._id);
        console.log("👤 User type:", user.type);

        const response = await getProviderServices(user._id);
        console.log("📦 API Response:", JSON.stringify(response, null, 2));

        // Check if response is successful
        if (response && response.success) {
          // ✅ CORRECT: response.data is the array of services
          const servicesData = response.data || [];
          console.log(`✅ Found ${servicesData.length} services`);

          if (servicesData.length > 0) {
            console.log(
              "📋 Service names:",
              servicesData.map((s) => s.name),
            );
          } else {
            console.log("ℹ️ No services found for this provider");
          }

          setServices(servicesData);
        } else {
          console.warn("⚠️ Response not successful:", response);
          setServices([]);
        }
      } catch (error) {
        console.error("❌ Error fetching services:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data,
        });

        if (error.response?.status !== 404) {
          toast.error("Failed to load your services. Please refresh the page.");
        }
        setServices([]);
      }
    };

    if (user?._id) {
      fetchUserServices();
    }
  }, [user]);

  const deleteService = (serviceId) => {
    setServiceToDelete(serviceId);
    setShowDeleteModal(true);
  };

  // In ManageProfile.jsx - Add this function

  // Toggle individual service type selection
  const toggleServiceType = (typeValue) => {
    setServiceForm((prev) => {
      const currentTypes = prev.serviceTypes || [];
      if (currentTypes.includes(typeValue)) {
        // Remove the service type
        return {
          ...prev,
          serviceTypes: currentTypes.filter((t) => t !== typeValue),
        };
      } else {
        // Add the service type
        return {
          ...prev,
          serviceTypes: [...currentTypes, typeValue],
        };
      }
    });
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      // Your delete API call
      setServices(services.filter((s) => (s.id || s._id) !== serviceToDelete));
      toast.success("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service. Please try again.");
    }
  };

  const toggleServiceStatus = (serviceId) => {
    setServices(
      services.map((s) =>
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s,
      ),
    );
  };

  // Handle gallery upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      let validFiles = 0;

      files.forEach((file) => {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 5MB.`);
          return;
        }
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert(`File ${file.name} is not an image.`);
          return;
        }
        formData.append("images", file);
        validFiles++;
      });

      if (validFiles === 0) {
        setUploading(false);
        return;
      }

      // Show uploading progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      const response = await saveGallery(formData);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        // Add new images to gallery
        setGallery((prev) => [...response.data, ...prev]);

        // Show success message
        // setSuccessMessage(response.message || "Images uploaded successfully!");
        toast.success(response.message || "Images uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error uploading images:", error);

      toast.error(
        error.response?.data?.error ||
          "Failed to upload images. Please try again.",
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    }
  };

  // Fetch gallery images
  // Fetch gallery images - FIXED

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      // Get the current user ID from the Redux state
      const userId = user?._id || user?.id;

      if (!userId) {
        console.warn("No user ID found, cannot fetch gallery");
        setGallery([]);
        setGalleryLoading(false);
        return;
      }

      // Call the function with proper parameters
      const response = await getGalleryImagesByUserId(userId, 1, 6); // Limit to 6 images

      if (response.success) {
        setGallery(response.data || []);
        console.log("getting the gallery from the backend ", gallery);
      } else {
        console.warn("Gallery fetch response not successful:", response);
        setGallery([]);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Failed to load gallery. Please refresh the page.");
      setGallery([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  // Delete gallery image
  const deleteGalleryItem = async (id) => {
    if (!id) return;

    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await deleteGalleryImage(id);
      if (response.success) {
        setGallery((prev) => prev.filter((item) => item._id !== id));
        setSuccessMessage("Image deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert(
        error.response?.data?.error ||
          "Failed to delete image. Please try again.",
      );
    }
  };

  // Update gallery item (title)
  const updateGalleryItem = async (id, field, value) => {
    // Update local state immediately for responsive UI
    setGallery((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, [field]: value } : item,
      ),
    );

    // Update in backend (only title is supported)
    if (field === "title") {
      try {
        await updateGalleryImage(id, value);
      } catch (error) {
        console.error("Error updating image title:", error);
        // Revert if failed
        await fetchGallery();
      }
    }
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const fileInput = galleryInputRef.current;
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      fileInput.files = dataTransfer.files;
      handleGalleryUpload({ target: fileInput });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Fetch gallery on component mount
  useEffect(() => {
    fetchGallery();
  }, []);

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
        <NavbarDashbaord />
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
    <>
      <div className="bg-[#F8FAFB] min-h-screen">
        {/* Navbar - Using the extracted component */}
        <NavbarDashbaord />

        <div className="pt-[72px] pb-12">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 animate-fadeInUp">
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
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  View Profile
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-[#0057FF]/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2 hover:scale-105 hover:shadow-xl"
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
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fadeInUp">
                <i className="fa-solid fa-check-circle text-green-500"></i>
                <span>{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fadeInUp">
                <i className="fa-solid fa-exclamation-circle text-red-500"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Tabs */}
            <div
              className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
                {[
                  { id: "profile", label: "Profile Info", icon: "fa-user" },
                  { id: "services", label: "Services", icon: "fa-briefcase" },
                  { id: "gallery", label: "Work Gallery", icon: "fa-images" },
                  { id: "settings", label: "Settings", icon: "fa-gear" },
                ].map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap capitalize transition-all border-b-2 flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-[#0057FF] text-[#0057FF] bg-[#F5F8FF]"
                        : "border-transparent text-gray-500 hover:text-[#0057FF] hover:bg-gray-50"
                    }`}
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    <i className={`fa-solid ${tab.icon}`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {/* Profile Info Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-8 animate-fadeInUp">
                    {/* Profile Photo & Cover */}
                    <div className="space-y-4">
                      <h2
                        className="text-lg font-bold text-[#1A1A1A] animate-fadeInRight"
                        style={{ animationDelay: "0.1s" }}
                      >
                        Profile Photos
                      </h2>
                      <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <img
                          src={
                            user?.coverPicture?.url ||
                            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
                          }
                          alt="Cover"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <label className="cursor-pointer bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white transition-colors flex items-center gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300">
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
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <img
                            src={
                              user?.avatar?.url ||
                              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                            }
                            alt="Avatar"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <label className="cursor-pointer w-full h-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
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
                      <h2
                        className="text-lg font-bold text-[#1A1A1A] animate-fadeInRight"
                        style={{ animationDelay: "0.15s" }}
                      >
                        Personal Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.2s" }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name.full"
                            value={
                              formData.name?.full || user?.name?.full || ""
                            }
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.25s" }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                          </label>
                          <input
                            type="text"
                            name="name.display"
                            value={
                              formData.name?.display ||
                              user?.name?.display ||
                              ""
                            }
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            placeholder="How you want to be displayed"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.3s" }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || user?.phone || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.35s" }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            disabled
                            type="email"
                            name="email"
                            value={formData.email || user?.email || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50 bg-gray-50"
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Provider Profile */}
                    <div className="space-y-4">
                      <h2
                        className="text-lg font-bold text-[#1A1A1A] animate-fadeInRight"
                        style={{ animationDelay: "0.4s" }}
                      >
                        Provider Profile
                      </h2>
                      <div
                        className="animate-fadeInUp"
                        style={{ animationDelay: "0.45s" }}
                      >
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 resize-none hover:border-[#0057FF]/50"
                          placeholder="Tell customers about yourself and your services..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.5s" }}
                        >
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            placeholder="e.g., Cleaning, Plumbing, Electrical"
                          />
                        </div>
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.55s" }}
                        >
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            placeholder="e.g., East Legon, Accra"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.6s" }}
                        >
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            min="0"
                          />
                        </div>
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.65s" }}
                        >
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            min="1"
                          />
                        </div>
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.7s" }}
                        >
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className="animate-fadeInUp"
                          style={{ animationDelay: "0.75s" }}
                        >
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div
                          className="flex items-center animate-fadeInUp"
                          style={{ animationDelay: "0.8s" }}
                        >
                          <label className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300">
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
                              className="w-5 h-5 text-[#0057FF] border-gray-300 rounded focus:ring-[#0057FF] transition-all duration-300"
                            />
                            <span className="text-sm text-gray-700">
                              Open for Work
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Secondary Categories */}
                      <div
                        className="animate-fadeInUp"
                        style={{ animationDelay: "0.85s" }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Categories
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && addCategory()
                            }
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                            placeholder="Add a category (e.g., Residential, Commercial)"
                          />
                          <button
                            onClick={addCategory}
                            className="px-4 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
                              className="inline-flex items-center gap-2 bg-[#F5F8FF] text-[#0057FF] px-3 py-1.5 rounded-lg text-sm border border-[#E8F0FF] animate-fadeInUp"
                              style={{
                                animationDelay: `${0.9 + index * 0.05}s`,
                              }}
                            >
                              {category}
                              <button
                                onClick={() => removeCategory(category)}
                                className="hover:text-red-500 transition-colors hover:scale-110 transform duration-200"
                              >
                                <i className="fa-solid fa-times"></i>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Location Information */}
                      <div
                        className="space-y-4 border-t border-gray-200 pt-4 animate-fadeInUp"
                        style={{ animationDelay: "0.95s" }}
                      >
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
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
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
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
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
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
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
                  <div className="space-y-6 animate-fadeInUp">
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
                        className="px-4 py-2 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#0057FF]/25 hover:scale-105 hover:shadow-xl"
                      >
                        <i className="fa-solid fa-plus"></i>
                        <span>Add Service</span>
                      </button>
                    </div>

                    {/* Services List */}
                    {/* Alternative: Compact Card Design */}
                    {services.length > 0 && (
                      <div className="grid grid-cols-1 gap-4">
                        {services.map((service, index) => {
                          const isActive =
                            service.is_active !== undefined
                              ? service.is_active
                              : service.isActive;
                          const serviceId = service.id || service._id;
                          const serviceTypes = service.serviceTypes || [];
                          const pricingModel =
                            service.pricingModel || "package";
                          const basePrice =
                            service.basePrice || service.price || 0;

                          return (
                            <div
                              key={serviceId}
                              className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg hover:border-[#0057FF]/30 overflow-hidden ${
                                isActive
                                  ? "border-[#E8F0FF]"
                                  : "border-gray-200 opacity-70"
                              } animate-fadeInUp`}
                              style={{
                                animationDelay: `${0.1 + index * 0.05}s`,
                              }}
                            >
                              <div className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1.5">
                                      <h3 className="font-bold text-[#1A1A1A] truncate">
                                        {service.name}
                                      </h3>
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                          isActive
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                      >
                                        {isActive ? "Active" : "Inactive"}
                                      </span>
                                      <span className="px-2 py-0.5 bg-[#0057FF]/10 text-[#0057FF] rounded-full text-xs font-medium flex-shrink-0">
                                        {service.category || "Uncategorized"}
                                      </span>
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                                      {service.description ||
                                        "No description provided"}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2">
                                      {/* Service Types - Compact */}
                                      {serviceTypes
                                        .slice(0, 3)
                                        .map((type, idx) => {
                                          const typeInfo =
                                            getServiceTypesForCategory(
                                              service.category,
                                            )?.find((t) => t.value === type);
                                          return (
                                            <span
                                              key={idx}
                                              className="text-xs bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200"
                                            >
                                              {typeInfo?.icon || "📌"}{" "}
                                              {typeInfo?.label || type}
                                            </span>
                                          );
                                        })}
                                      {serviceTypes.length > 3 && (
                                        <span className="text-xs text-gray-400">
                                          +{serviceTypes.length - 3} more
                                        </span>
                                      )}

                                      {/* Price */}
                                      <span className="text-sm font-bold text-[#0057FF] ml-auto">
                                        GH₵{" "}
                                        {pricingModel === "package"
                                          ? basePrice
                                          : service.individualPrices
                                            ? Object.values(
                                                service.individualPrices,
                                              )[0] || 0
                                            : 0}
                                        {service.priceType === "hourly" &&
                                          "/hr"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-1 ml-3 flex-shrink-0">
                                    <button
                                      onClick={() => openServiceModal(service)}
                                      className="w-7 h-7 rounded-lg bg-blue-50 text-[#0057FF] hover:bg-blue-100 transition-all duration-300 flex items-center justify-center hover:scale-110"
                                      title="Edit"
                                    >
                                      <i className="fa-solid fa-pen text-xs"></i>
                                    </button>
                                    <button
                                      onClick={() =>
                                        toggleServiceStatus(serviceId)
                                      }
                                      className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 ${
                                        isActive
                                          ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                      }`}
                                      title={
                                        isActive ? "Deactivate" : "Activate"
                                      }
                                    >
                                      <i
                                        className={`fa-solid ${isActive ? "fa-pause" : "fa-play"} text-xs`}
                                      ></i>
                                    </button>
                                    <button
                                      onClick={() => deleteService(serviceId)}
                                      className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-300 flex items-center justify-center hover:scale-110"
                                      title="Delete"
                                    >
                                      <i className="fa-solid fa-trash text-xs"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Service Stats */}
                    {services.length > 0 && (
                      <div
                        className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 animate-fadeInUp"
                        style={{ animationDelay: "0.2s" }}
                      >
                        <div className="text-center hover:scale-105 transition-transform duration-300">
                          <p className="text-2xl font-bold text-[#1A1A1A]">
                            {services.length}
                          </p>
                          <p className="text-xs text-gray-500">
                            Total Services
                          </p>
                        </div>
                        <div className="text-center hover:scale-105 transition-transform duration-300">
                          <p className="text-2xl font-bold text-emerald-600">
                            {
                              services.filter((s) => s.isActive || s.is_active)
                                .length
                            }
                          </p>
                          <p className="text-xs text-gray-500">Active</p>
                        </div>
                        <div className="text-center hover:scale-105 transition-transform duration-300">
                          <p className="text-2xl font-bold text-gray-400">
                            {
                              services.filter(
                                (s) => !(s.isActive || s.is_active),
                              ).length
                            }
                          </p>
                          <p className="text-xs text-gray-500">Inactive</p>
                        </div>
                        <div className="text-center hover:scale-105 transition-transform duration-300">
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
                  <div className="space-y-6 animate-fadeInUp">
                    <div className="flex items-center justify-between flex-wrap gap-4">
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
                        disabled={uploading}
                        className="px-4 py-2 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#0057FF]/25 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            <span>Uploading... {uploadProgress}%</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-plus"></i>
                            <span>Add Images</span>
                          </>
                        )}
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

                    {/* Upload Progress Bar */}
                    {uploading && (
                      <div className="bg-white border border-[#E8F0FF] rounded-2xl p-4 animate-fadeInUp">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Uploading images...
                          </span>
                          <span className="text-sm font-medium text-[#0057FF]">
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#0057FF] to-[#0066FF] h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Gallery Loading State */}
                    {galleryLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-2xl bg-gray-100 animate-pulse"
                          />
                        ))}
                      </div>
                    ) : gallery.length === 0 ? (
                      <div
                        className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 animate-fadeInUp hover:border-[#0057FF] transition-colors duration-300"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
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
                          className="px-6 py-2.5 bg-[#0057FF] text-white rounded-xl hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                        >
                          <i className="fa-solid fa-cloud-upload-alt"></i>
                          Upload Images
                        </button>
                        <p className="text-xs text-gray-400 mt-4">
                          Or drag and drop images here
                        </p>
                      </div>
                    ) : (
                      <>
                        <div
                          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                        >
                          {gallery.map((item, index) => (
                            <div
                              key={item._id}
                              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-transparent hover:border-[#0057FF] transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeInUp"
                              style={{
                                animationDelay: `${0.1 + index * 0.05}s`,
                              }}
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.title || "Work sample"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                                onError={(e) => {
                                  console.error(
                                    "Image failed to load:",
                                    item.imageUrl,
                                  );
                                  e.target.src =
                                    "https://via.placeholder.com/400x400?text=No+Image";
                                }}
                              />

                              {/* Overlay actions */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                <button
                                  onClick={() => {
                                    console.log(
                                      "🔍 Opening lightbox with item:",
                                      item,
                                    );
                                    console.log("📸 Image URL:", item.imageUrl);
                                    // Make sure we're setting the selected image correctly
                                    setSelectedImage({ ...item }); // Create a copy to ensure state update
                                    setIsLightboxOpen(true);
                                  }}
                                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors hover:scale-110 transform duration-200"
                                >
                                  <i className="fa-solid fa-eye text-gray-700 text-sm"></i>
                                </button>
                                <button
                                  onClick={() => deleteGalleryItem(item._id)}
                                  className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors hover:scale-110 transform duration-200"
                                >
                                  <i className="fa-solid fa-trash text-white text-sm"></i>
                                </button>
                              </div>

                              {/* Title input */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-3">
                                <input
                                  type="text"
                                  value={item.title || ""}
                                  onChange={(e) =>
                                    updateGalleryItem(
                                      item._id,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Add title"
                                  className="w-full bg-transparent text-white text-sm font-medium placeholder:text-white/50 focus:outline-none border-b border-white/20 focus:border-white/50 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                          ))}

                          {/* Add more button at the end */}
                          <div
                            className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#0057FF] transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 group"
                            onClick={() => galleryInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                          >
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-50 transition-colors">
                                <i className="fa-solid fa-plus text-gray-400 group-hover:text-[#0057FF] text-xl"></i>
                              </div>
                              <p className="text-xs text-gray-400 group-hover:text-[#0057FF] transition-colors">
                                Add More
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Gallery Stats */}
                        <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 animate-fadeInUp">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-[#1A1A1A]">
                              {gallery.length}
                            </p>
                            <p className="text-xs text-gray-500">
                              Total Images
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-[#0057FF]">
                              {
                                gallery.filter(
                                  (item) => item.title && item.title !== "",
                                ).length
                              }
                            </p>
                            <p className="text-xs text-gray-500">With Titles</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-600">
                              {gallery.filter((item) => item.createdAt).length}
                            </p>
                            <p className="text-xs text-gray-500">Uploaded</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Lightbox Modal - FIXED */}
                {/* Lightbox Modal - FIXED */}
                {isLightboxOpen && selectedImage && (
                  <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
                    onClick={() => {
                      setIsLightboxOpen(false);
                      setSelectedImage(null);
                    }}
                  >
                    <div
                      className="relative max-w-5xl w-full max-h-[90vh]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close button */}
                      <button
                        className="absolute -top-14 right-0 text-white hover:text-gray-300 transition-colors text-3xl hover:scale-110 transform duration-200"
                        onClick={() => {
                          setIsLightboxOpen(false);
                          setSelectedImage(null);
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>

                      {/* Image container */}
                      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                        <div className="bg-black/5 flex items-center justify-center min-h-[300px] max-h-[70vh] relative">
                          {/* Debug info - shows what URL is being used */}
                          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            URL: {selectedImage.imageUrl || "No URL"}
                          </div>

                          <img
                            key={selectedImage._id} // Add key to force re-render
                            src={selectedImage.imageUrl}
                            alt={selectedImage.title || "Work sample"}
                            className="w-full h-full max-h-[70vh] object-contain"
                            onError={(e) => {
                              console.error(
                                "❌ Lightbox image failed to load:",
                                selectedImage.imageUrl,
                              );
                              console.log(
                                "📦 Full selectedImage object:",
                                selectedImage,
                              );
                              // Try alternative URL if available
                              const fallbackUrl =
                                selectedImage.url ||
                                selectedImage.images?.[0]?.url;
                              if (
                                fallbackUrl &&
                                fallbackUrl !== selectedImage.imageUrl
                              ) {
                                console.log(
                                  "🔄 Trying fallback URL:",
                                  fallbackUrl,
                                );
                                e.target.src = fallbackUrl;
                              } else {
                                e.target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }
                            }}
                            onLoad={() => {
                              console.log(
                                "✅ Lightbox image loaded successfully:",
                                selectedImage.imageUrl,
                              );
                            }}
                          />
                        </div>

                        {/* Image info */}
                        <div className="p-6 bg-white">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-xl text-[#1A1A1A]">
                                {selectedImage.title || "Untitled"}
                              </h3>
                              {selectedImage.category && (
                                <p className="text-sm text-[#0057FF] font-medium mt-1">
                                  {selectedImage.category}
                                </p>
                              )}
                              {selectedImage.description && (
                                <p className="text-sm text-gray-600 mt-2">
                                  {selectedImage.description}
                                </p>
                              )}
                              {selectedImage.createdAt && (
                                <p className="text-xs text-gray-400 mt-2">
                                  Uploaded:{" "}
                                  {new Date(
                                    selectedImage.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setIsLightboxOpen(false);
                                setSelectedImage(null);
                              }}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium hover:scale-105 transform duration-200"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Settings Tab */}
                {activeTab === "settings" && (
                  <div className="space-y-6 animate-fadeInUp">
                    <div>
                      <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                        Account Settings
                      </h2>
                      <div className="bg-gray-50 rounded-2xl p-6 mb-6 animate-fadeInUp hover:shadow-md transition-shadow duration-300">
                        <h3 className="font-semibold text-[#1A1A1A] mb-3">
                          Notifications
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between cursor-pointer hover:bg-gray-100/50 p-2 rounded-lg transition-colors duration-200">
                            <span className="text-sm text-gray-700">
                              SMS Notifications
                            </span>
                            <input
                              type="checkbox"
                              defaultChecked={
                                user?.preferences?.notifications?.sms !== false
                              }
                              className="w-5 h-5 text-[#0057FF] border-gray-300 rounded focus:ring-[#0057FF] transition-all duration-300"
                            />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer hover:bg-gray-100/50 p-2 rounded-lg transition-colors duration-200">
                            <span className="text-sm text-gray-700">
                              Email Notifications
                            </span>
                            <input
                              type="checkbox"
                              defaultChecked={
                                user?.preferences?.notifications?.email !==
                                false
                              }
                              className="w-5 h-5 text-[#0057FF] border-gray-300 rounded focus:ring-[#0057FF] transition-all duration-300"
                            />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer hover:bg-gray-100/50 p-2 rounded-lg transition-colors duration-200">
                            <span className="text-sm text-gray-700">
                              Push Notifications
                            </span>
                            <input
                              type="checkbox"
                              defaultChecked={
                                user?.preferences?.notifications?.push !== false
                              }
                              className="w-5 h-5 text-[#0057FF] border-gray-300 rounded focus:ring-[#0057FF] transition-all duration-300"
                            />
                          </label>
                        </div>
                      </div>
                      <div
                        className="bg-gray-50 rounded-2xl p-6 mb-6 animate-fadeInUp"
                        style={{ animationDelay: "0.1s" }}
                      >
                        <h3 className="font-semibold text-[#1A1A1A] mb-3">
                          Language
                        </h3>
                        <select
                          defaultValue={user?.preferences?.language || "en"}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 bg-white hover:border-[#0057FF]/50"
                        >
                          <option value="en">English</option>
                          <option value="fr">French</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                      <div
                        className="border-2 border-red-200 rounded-2xl p-6 animate-fadeInUp"
                        style={{ animationDelay: "0.15s" }}
                      >
                        <h3 className="font-semibold text-red-600 mb-2">
                          Danger Zone
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Once you delete your account, there is no going back.
                        </p>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 text-sm hover:scale-105 hover:shadow-lg">
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
        {/* Service Modal */}
        {showServiceModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
              onClick={closeServiceModal}
            />
            <div className="min-h-screen px-4 flex items-center justify-center">
              <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-6 md:p-8 animate-scaleIn">
                <button
                  onClick={closeServiceModal}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:scale-110"
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
                  <div
                    className="animate-fadeInUp"
                    style={{ animationDelay: "0.05s" }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={serviceForm.name}
                      onChange={handleServiceInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                      placeholder="e.g., Pipe Repair Service"
                    />
                  </div>

                  {/* Description */}
                  <div
                    className="animate-fadeInUp"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={serviceForm.description}
                      onChange={handleServiceInputChange}
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 resize-none hover:border-[#0057FF]/50"
                      placeholder="Describe what this service includes..."
                    />
                  </div>

                  {/* Category and Service Type in One Row */}

                  {/* Category and Service Type in One Row */}
                  {/* Service Category - Auto-set from user's primary category */}
                  <div
                    className="animate-fadeInUp"
                    style={{ animationDelay: "0.15s" }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Category
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 flex items-center gap-2">
                      <span className="text-lg">
                        {CATEGORIES.find((c) => c.value === userPrimaryCategory)
                          ?.icon || "📌"}
                      </span>
                      <span className="font-medium">
                        {userPrimaryCategory || "Not set"}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        (Based on your profile)
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Your services are automatically categorized under your
                      primary service category
                    </p>
                  </div>

                  {/* Service Types Selection */}
                  <div
                    className="animate-fadeInUp"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Types You Offer *
                    </label>
                    <p className="text-xs text-gray-400 mb-2">
                      Select all the specific services you provide within this
                      category
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getServiceTypesForCategory(userPrimaryCategory).map(
                        (type) => {
                          const isSelected = serviceForm.serviceTypes?.includes(
                            type.value,
                          );
                          return (
                            <label
                              key={type.value}
                              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? "bg-[#0057FF]/5 border-2 border-[#0057FF]"
                                  : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                              }`}
                              onClick={() => toggleServiceType(type.value)}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                    isSelected
                                      ? "bg-[#0057FF] border-[#0057FF]"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {isSelected && (
                                    <i className="fa-solid fa-check text-white text-xs"></i>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{type.icon}</span>
                                  <span className="font-medium text-sm text-gray-700">
                                    {type.label}
                                  </span>
                                </div>
                                {type.description && (
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {type.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Pricing Configuration
                    </h4>

                    {/* Pricing Model Selection */}
                    <div className="mb-4">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="pricingModel"
                            value="package"
                            checked={serviceForm.pricingModel === "package"}
                            onChange={() =>
                              setServiceForm((prev) => ({
                                ...prev,
                                pricingModel: "package",
                              }))
                            }
                            className="w-4 h-4 text-[#0057FF]"
                          />
                          <span className="text-sm">Simple Package Price</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="pricingModel"
                            value="individual"
                            checked={serviceForm.pricingModel === "individual"}
                            onChange={() =>
                              setServiceForm((prev) => ({
                                ...prev,
                                pricingModel: "individual",
                              }))
                            }
                            className="w-4 h-4 text-[#0057FF]"
                          />
                          <span className="text-sm">Individual Pricing</span>
                        </label>
                      </div>
                    </div>

                    {/* Package Pricing (Simplest) */}
                    {serviceForm.pricingModel === "package" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Base Service Price (GH₵)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                GH₵
                              </span>
                              <input
                                type="number"
                                name="basePrice"
                                value={serviceForm.basePrice}
                                onChange={handleServiceInputChange}
                                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300"
                                placeholder="Starting price"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              This is your standard rate for most services
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pricing Type
                            </label>
                            <select
                              name="priceType"
                              value={serviceForm.priceType}
                              onChange={handleServiceInputChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 appearance-none bg-white"
                            >
                              <option value="fixed">Fixed Price</option>
                              <option value="hourly">Hourly Rate</option>
                              <option value="daily">Daily Rate</option>
                              <option value="negotiable">Negotiable</option>
                            </select>
                          </div>
                        </div>

                        {/* Add-on pricing (optional) */}
                        {serviceForm.serviceTypes?.length > 1 && (
                          <details className="mt-3">
                            <summary className="text-sm text-[#0057FF] cursor-pointer hover:underline">
                              <i className="fa-solid fa-plus-circle mr-1"></i>
                              Set additional pricing for specific service types
                              (optional)
                            </summary>
                            <div className="mt-3 space-y-2">
                              {serviceForm.serviceTypes.map((type) => {
                                const typeInfo = getServiceTypesForCategory(
                                  userPrimaryCategory,
                                ).find((t) => t.value === type);
                                return (
                                  <div
                                    key={type}
                                    className="flex items-center gap-3 bg-white rounded-lg p-2"
                                  >
                                    <span className="text-sm flex-1">
                                      {typeInfo?.icon} {typeInfo?.label}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400">
                                        Additional:
                                      </span>
                                      <div className="relative w-32">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                          GH₵
                                        </span>
                                        <input
                                          type="number"
                                          value={
                                            serviceForm.individualPrices?.[
                                              type
                                            ] || ""
                                          }
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setServiceForm((prev) => ({
                                              ...prev,
                                              individualPrices: {
                                                ...prev.individualPrices,
                                                [type]: value
                                                  ? parseFloat(value)
                                                  : "",
                                              },
                                            }));
                                          }}
                                          placeholder="Extra"
                                          className="w-full pl-10 pr-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none text-sm"
                                          min="0"
                                          step="0.01"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </details>
                        )}
                      </div>
                    )}

                    {/* Individual Pricing (Advanced) */}
                    {serviceForm.pricingModel === "individual" && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Set a price for each service type:
                        </p>
                        <div className="space-y-3">
                          {serviceForm.serviceTypes?.map((type) => {
                            const typeInfo = getServiceTypesForCategory(
                              userPrimaryCategory,
                            ).find((t) => t.value === type);
                            return (
                              <div
                                key={type}
                                className="bg-white rounded-lg p-3 border border-gray-200"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">
                                    {typeInfo?.icon}
                                  </span>
                                  <span className="text-sm font-medium flex-1">
                                    {typeInfo?.label}
                                  </span>
                                  <div className="relative w-40">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                      GH₵
                                    </span>
                                    <input
                                      type="number"
                                      value={
                                        serviceForm.individualPrices?.[type] ||
                                        ""
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setServiceForm((prev) => ({
                                          ...prev,
                                          individualPrices: {
                                            ...prev.individualPrices,
                                            [type]: value
                                              ? parseFloat(value)
                                              : "",
                                          },
                                        }));
                                      }}
                                      placeholder="Price"
                                      className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none"
                                      min="0"
                                      step="0.01"
                                    />
                                  </div>
                                  <select
                                    value={serviceForm.priceType}
                                    onChange={(e) =>
                                      setServiceForm((prev) => ({
                                        ...prev,
                                        priceType: e.target.value,
                                      }))
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none text-sm bg-white"
                                  >
                                    <option value="fixed">Fixed</option>
                                    <option value="hourly">/hr</option>
                                    <option value="daily">/day</option>
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dropdown rendered via Portal */}
                  {isCategoryOpen &&
                    createPortal(
                      <div
                        style={{
                          position: "fixed",
                          top: dropdownPosition.top,
                          left: dropdownPosition.left,
                          width: dropdownPosition.width || "auto",
                          maxWidth: "calc(100% - 32px)",
                          zIndex: 99999,
                          background: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                          maxHeight: "240px",
                          overflowY: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((cat, index) => (
                            <button
                              key={cat.value}
                              onClick={() => {
                                // Update the form with selected category
                                setServiceForm((prev) => ({
                                  ...prev,
                                  category: cat.value,
                                  serviceType: "",
                                }));
                                // Update the search input to show the selected category
                                setCategorySearch(cat.label);
                                // Close the dropdown
                                setIsCategoryOpen(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left hover:bg-[#0057FF]/5 transition-colors flex items-center gap-2 ${
                                serviceForm.category === cat.value
                                  ? "bg-[#0057FF]/10 text-[#0057FF]"
                                  : "text-gray-700"
                              } ${index === 0 ? "rounded-t-xl" : ""} ${
                                index === filteredCategories.length - 1
                                  ? "rounded-b-xl"
                                  : ""
                              }`}
                            >
                              <span>{cat.icon}</span>
                              <span className="flex-1">{cat.label}</span>
                              {serviceForm.category === cat.value && (
                                <i className="fa-solid fa-check text-[#0057FF]"></i>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 rounded-xl">
                            No categories found
                          </div>
                        )}
                      </div>,
                      document.body,
                    )}

                  {/* Price and Pricing Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="animate-fadeInUp"
                      style={{ animationDelay: "0.25s" }}
                    >
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
                          className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div
                      className="animate-fadeInUp"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pricing Type
                      </label>
                      <select
                        name="priceType"
                        value={serviceForm.priceType}
                        onChange={handleServiceInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 appearance-none bg-white hover:border-[#0057FF]/50"
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

                  {/* Service Active Toggle */}
                  <div
                    className="flex items-center gap-3 pt-2 animate-fadeInUp"
                    style={{ animationDelay: "0.35s" }}
                  >
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
                        Service is{" "}
                        {serviceForm.isActive ? "active" : "inactive"}
                      </span>
                    </label>
                  </div>

                  {/* Additional Options */}
                  <div
                    className="border-t border-gray-100 pt-4 mt-2 animate-fadeInUp"
                    style={{ animationDelay: "0.4s" }}
                  >
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057FF]/20 focus:border-[#0057FF] outline-none transition-all duration-300 hover:border-[#0057FF]/50"
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
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-medium hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveService}
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#0057FF] to-[#0066FF] text-white rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg shadow-[#0057FF]/25 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105"
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
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => {
              setIsLightboxOpen(false);
              setSelectedImage(null);
            }}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full animate-scaleIn">
              <button
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors text-2xl hover:scale-110 transform duration-200"
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
      @keyframes slideDown {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes fadeInUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes fadeInRight {
        from {
          transform: translateX(-20px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes dropDown {
        from {
          transform: translateY(-10px) scale(0.95);
          opacity: 0;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes scaleIn {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .animate-slideDown {
        animation: slideDown 0.5s ease-out forwards;
      }

      .animate-fadeInUp {
        opacity: 0;
        animation: fadeInUp 0.5s ease-out forwards;
      }

      .animate-fadeInRight {
        opacity: 0;
        animation: fadeInRight 0.5s ease-out forwards;
      }

      .animate-dropDown {
        animation: dropDown 0.2s ease-out forwards;
      }

      .animate-scaleIn {
        animation: scaleIn 0.3s ease-out forwards;
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }

      .animate-pulse {
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `}</style>
      </div>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setServiceToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Service?"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete Service"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}

export default ManageProfile;
