// mockProviderData.js
export const mockProviderData = {
  _id: "provider_12345",
  id: "provider_12345",
  name: {
    full: "Kwame Mensah",
    first: "Kwame",
    last: "Mensah",
  },
  email: "kwame.mensah@example.com",
  phone: "+233 24 123 4567",

  // Profile images
  avatar: {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  coverPicture: {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  },

  // Provider specific data
  provider_profile: {
    category: "Electrical Services",
    secondaryCategories: [
      "Home Wiring",
      "Smart Home Installation",
      "Security Systems",
    ],
    bio: "With over 10 years of experience in the electrical industry, I specialize in residential and commercial electrical installations. I'm passionate about delivering safe, reliable, and cost-effective solutions for my clients. My expertise includes home wiring, smart home systems, security installations, and electrical repairs. I'm fully licensed and insured, and I pride myself on my attention to detail and commitment to customer satisfaction.",
    experience_years: 10,
    base_price: 150,
    hourly_rate: 45,
    service_radius_km: 30,
    service_area: "Accra Metropolitan Area",
    open_for_work: true,
    availability: {
      schedule: {
        monday: "8:00 AM - 6:00 PM",
        tuesday: "8:00 AM - 6:00 PM",
        wednesday: "8:00 AM - 6:00 PM",
        thursday: "8:00 AM - 6:00 PM",
        friday: "8:00 AM - 5:00 PM",
        saturday: "9:00 AM - 2:00 PM",
        sunday: "Closed",
      },
    },
  },

  // Location
  location: {
    home_address: {
      area: "East Legon, Accra",
      city: "Accra",
      region: "Greater Accra",
    },
    coordinates: {
      lat: 5.6037,
      lng: -0.187,
    },
  },

  // Languages
  languages: ["English", "Twi", "Ga"],

  // Services
  services: [
    {
      _id: "service_001",
      name: "Full Home Wiring",
      description: "Complete electrical wiring for new homes and renovations",
      price: 150,
      duration: "2-3 days",
      icon: "fa-bolt",
    },
    {
      _id: "service_002",
      name: "Smart Home Installation",
      description: "Install smart lighting, thermostats, and security systems",
      price: 200,
      duration: "1-2 days",
      icon: "fa-microchip",
    },
    {
      _id: "service_003",
      name: "Security System Setup",
      description: "CCTV and alarm system installation with remote monitoring",
      price: 180,
      duration: "4-6 hours",
      icon: "fa-video",
    },
    {
      _id: "service_004",
      name: "Electrical Repairs",
      description: "Fix faulty wiring, outlets, and electrical fixtures",
      price: 80,
      duration: "1-3 hours",
      icon: "fa-tools",
    },
  ],

  // Ratings & Trust
  rating: 4.8,
  trust: {
    score: 95,
    average_rating: 4.8,
    total_ratings: 142,
    trust_score: 95,
  },
  reviews: 142,

  // Reviews list
  reviewList: [
    {
      _id: "review_001",
      name: "Ama Serwaa",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      rating: 5,
      date: "2026-05-15",
      comment:
        "Kwame did an excellent job wiring our new home. He was professional, punctual, and the quality of work was outstanding. Highly recommend!",
    },
    {
      _id: "review_002",
      name: "John Mensah",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      rating: 4,
      date: "2026-04-28",
      comment:
        "Great work installing our smart home system. Only issue was a slight delay in start time, but the quality made up for it.",
    },
    {
      _id: "review_003",
      name: "Esi Abena",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      rating: 5,
      date: "2026-03-12",
      comment:
        "Kwame helped us with a complex electrical issue that other technicians couldn't solve. His expertise is truly valuable.",
    },
    {
      _id: "review_004",
      name: "Kwaku Asare",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      rating: 4.5,
      date: "2026-02-20",
      comment:
        "Professional service from start to finish. The security system installation was flawless and he took time to explain everything.",
    },
  ],

  // Verification
  verification: {
    phone: {
      verified: true,
    },
    email: {
      verified: true,
    },
    identity: {
      verified: true,
    },
  },

  // Badges
  badges: ["Verified", "Top Rated", "Trusted"],

  // Display price
  displayPrice: "GH₵ 150",

  // Additional fields
  about:
    "With over 10 years of experience in the electrical industry, I specialize in residential and commercial electrical installations. I'm passionate about delivering safe, reliable, and cost-effective solutions for my clients.",
  bio: "With over 10 years of experience in the electrical industry, I specialize in residential and commercial electrical installations. I'm passionate about delivering safe, reliable, and cost-effective solutions for my clients.",

  // Availability (as used in the component)
  availability: {
    schedule: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "9:00 AM - 2:00 PM",
      sunday: "Closed",
    },
  },
};

// Alternative mock providers for different scenarios
export const alternativeMockProviders = {
  // A provider with fewer reviews and services
  basicProvider: {
    _id: "provider_67890",
    id: "provider_67890",
    name: {
      full: "Mawuli Agbeko",
    },
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
    provider_profile: {
      category: "Plumbing Services",
      bio: "Professional plumbing services for residential and commercial properties",
      experience_years: 5,
      base_price: 100,
      hourly_rate: 35,
      service_area: "Tema Metropolitan Area",
      open_for_work: true,
    },
    location: "Tema, Ghana",
    rating: 4.5,
    reviews: 67,
    services: [
      {
        _id: "service_005",
        name: "Pipe Installation",
        description: "Install new plumbing pipes and fixtures",
        price: 100,
        icon: "fa-wrench",
      },
    ],
    reviewList: [
      {
        name: "Comfort Nyarko",
        rating: 5,
        date: "2026-06-01",
        comment: "Excellent plumbing service!",
      },
    ],
    verification: {
      phone: { verified: true },
      email: { verified: true },
    },
    badges: ["Verified"],
    displayPrice: "GH₵ 100",
  },

  // A provider that is currently unavailable
  unavailableProvider: {
    _id: "provider_11111",
    id: "provider_11111",
    name: {
      full: "Akua Dansoa",
    },
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80",
    provider_profile: {
      category: "Interior Design",
      bio: "Creative interior design solutions for homes and offices",
      experience_years: 8,
      base_price: 200,
      hourly_rate: 50,
      service_area: "Kumasi Metropolitan Area",
      open_for_work: false,
    },
    location: "Kumasi, Ghana",
    rating: 4.9,
    reviews: 89,
    services: [],
    reviewList: [],
    verification: {
      phone: { verified: true },
      email: { verified: false },
    },
    badges: ["Top Rated"],
    displayPrice: "GH₵ 200",
  },
};

// Function to simulate API call
export const mockApiCall = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // You can use this to simulate different providers based on ID
      if (id === "provider_67890") {
        resolve({ data: alternativeMockProviders.basicProvider });
      } else if (id === "provider_11111") {
        resolve({ data: alternativeMockProviders.unavailableProvider });
      } else {
        resolve({ data: mockProviderData });
      }
    }, 500);
  });
};
