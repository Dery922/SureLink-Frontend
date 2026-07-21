// components/CookieConsentEnhanced.js - With slower, smoother animations

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsentEnhanced = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasConsent, setHasConsent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check for existing consent on mount
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      try {
        setPreferences(JSON.parse(consent));
        setHasConsent(true);
        setShowBanner(false);
      } catch (e) {
        setHasConsent(false);
      }
    }
  }, []);

  // Track scroll direction and position
  useEffect(() => {
    if (hasConsent) return;

    const handleScroll = () => {
      const currentScrollY =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollPercentage =
        (currentScrollY / (documentHeight - windowHeight)) * 100;

      // Determine scroll direction with threshold
      if (currentScrollY > lastScrollY + 10) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY - 10) {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);

      // Show banner when scrolling down past 50%
      if (
        scrollPercentage > 50 &&
        scrollDirection === "down" &&
        !showBanner &&
        !isAnimating
      ) {
        setIsAnimating(true);
        setShowBanner(true);
        setTimeout(() => setIsAnimating(false), 800);
      }

      // Hide banner when scrolling back up above 40%
      if (
        scrollPercentage < 40 &&
        scrollDirection === "up" &&
        showBanner &&
        !isAnimating
      ) {
        setIsAnimating(true);
        setShowBanner(false);
        setTimeout(() => setIsAnimating(false), 800);
      }
    };

    let timeoutId;
    const debouncedScroll = () => {
      if (timeoutId) {
        cancelAnimationFrame(timeoutId);
      }
      timeoutId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", debouncedScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
      if (timeoutId) {
        cancelAnimationFrame(timeoutId);
      }
    };
  }, [lastScrollY, scrollDirection, showBanner, hasConsent, isAnimating]);

  const savePreferences = (prefs) => {
    localStorage.setItem("cookieConsent", JSON.stringify(prefs));
    setPreferences(prefs);
    setHasConsent(true);
    setIsAnimating(true);
    setShowBanner(false);
    setTimeout(() => setIsAnimating(false), 800);
    window.dispatchEvent(
      new CustomEvent("cookieConsentUpdated", { detail: prefs }),
    );
  };

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleAcceptNecessary = () => {
    savePreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  // ==========================================
  // SLOWER ANIMATIONS - More natural feel
  // ==========================================

  // Banner animations - Slower spring with more damping
  const bannerVariants = {
    hidden: {
      y: 100,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        duration: 0.8,
      },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        duration: 0.8,
        delay: 0.1,
      },
    },
    exit: {
      y: 100,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
        duration: 0.6,
      },
    },
  };

  // Modal overlay animations
  const modalOverlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  // Modal animations - Slower with more elegant feel
  const modalVariants = {
    hidden: {
      scale: 0.95,
      opacity: 0,
      y: 30,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 28,
        stiffness: 180,
        duration: 0.7,
        delay: 0.1,
      },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: 30,
      transition: {
        type: "spring",
        damping: 28,
        stiffness: 180,
        duration: 0.5,
      },
    },
  };

  // Icon animation - Slower rotation
  const iconVariants = {
    animate: {
      rotate: [0, 12, -12, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Button hover animations
  const buttonHoverVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 4px 20px rgba(0, 87, 255, 0.3)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.97,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.15,
      },
    },
  };

  // Don't render if consent already given
  if (hasConsent) return null;

  return (
    <AnimatePresence mode="wait">
      {showBanner && (
        <motion.div
          key="cookie-banner"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <motion.div
                    variants={iconVariants}
                    animate="animate"
                    className="flex-shrink-0 mt-1"
                  >
                    <svg
                      className="w-6 h-6 text-[#0057FF]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      🍪 We Use Cookies
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl">
                      We use cookies to enhance your experience. By continuing
                      to visit this site you agree to our use of cookies.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSettings(true)}
                      className="text-xs text-[#0057FF] hover:underline font-medium mt-1 transition-all duration-300 inline-flex items-center gap-1"
                    >
                      Learn more & customize
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <motion.button
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                >
                  Necessary Only
                </motion.button>
                <motion.button
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleAcceptAll}
                  className="px-5 py-2 bg-[#0057FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Accept All Cookies
                </motion.button>
              </div>
            </div>
          </div>

          {/* Settings Modal */}
          <AnimatePresence mode="wait">
            {showSettings && (
              <motion.div
                key="cookie-modal-overlay"
                variants={modalOverlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowSettings(false)}
              >
                <motion.div
                  key="cookie-modal"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Cookie Settings
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowSettings(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </motion.button>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      Choose which cookies you want to allow. Necessary cookies
                      are always required for the website to function properly.
                    </p>

                    <div className="space-y-4">
                      {/* Necessary Cookies - Always required */}
                      <div className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Necessary Cookies
                          </p>
                          <p className="text-xs text-gray-500">
                            Required for the website to function properly
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#0057FF] bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                          Always On
                        </span>
                      </div>

                      {/* Functional Cookies */}
                      <motion.div
                        whileHover={{
                          backgroundColor: "rgba(243, 244, 246, 0.8)",
                        }}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Functional Cookies
                          </p>
                          <p className="text-xs text-gray-500">
                            Enhance your experience with personalized features
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.functional}
                            onChange={() =>
                              setPreferences({
                                ...preferences,
                                functional: !preferences.functional,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0057FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-[#0057FF]"></div>
                        </label>
                      </motion.div>

                      {/* Analytics Cookies */}
                      <motion.div
                        whileHover={{
                          backgroundColor: "rgba(243, 244, 246, 0.8)",
                        }}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Analytics Cookies
                          </p>
                          <p className="text-xs text-gray-500">
                            Help us improve by tracking how you use our site
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.analytics}
                            onChange={() =>
                              setPreferences({
                                ...preferences,
                                analytics: !preferences.analytics,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0057FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-[#0057FF]"></div>
                        </label>
                      </motion.div>

                      {/* Marketing Cookies */}
                      <motion.div
                        whileHover={{
                          backgroundColor: "rgba(243, 244, 246, 0.8)",
                        }}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Marketing Cookies
                          </p>
                          <p className="text-xs text-gray-500">
                            Enable personalized ads and marketing content
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.marketing}
                            onChange={() =>
                              setPreferences({
                                ...preferences,
                                marketing: !preferences.marketing,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0057FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-[#0057FF]"></div>
                        </label>
                      </motion.div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 4px 20px rgba(0, 87, 255, 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          savePreferences(preferences);
                          setShowSettings(false);
                        }}
                        className="flex-1 px-4 py-2.5 bg-[#0057FF] text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        Save Preferences
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          savePreferences({
                            necessary: true,
                            functional: false,
                            analytics: false,
                            marketing: false,
                          });
                          setShowSettings(false);
                        }}
                        className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-all duration-300"
                      >
                        Reject All
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentEnhanced;
