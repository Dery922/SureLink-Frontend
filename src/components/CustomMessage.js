// src/components/CustomMessage.jsx (Enhanced Version with Modal Support)
import { useState, useEffect, createContext, useContext } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

// Create context
const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within MessageProvider");
  }
  return context;
};

// Types of messages
const MESSAGE_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  LOADING: "loading",
  MODAL: "modal",
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [modalConfig, setModalConfig] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Show toast notification
  const showMessage = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    const newMessage = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now(),
    };

    setCurrentMessage(newMessage);
    setIsVisible(true);

    if (duration > 0) {
      setTimeout(() => {
        hideMessage(id);
      }, duration);
    }

    return id;
  };

  const hideMessage = (id) => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentMessage(null);
    }, 300);
  };

  // Show modal (like your booking error modal)
  const showModal = (config) => {
    setModalConfig({
      title: config.title || "",
      message: config.message || "",
      type: config.type || "info",
      confirmText: config.confirmText || "OK",
      cancelText: config.cancelText || "",
      onConfirm: config.onConfirm || (() => {}),
      onCancel: config.onCancel || (() => {}),
      showCancel: config.showCancel || false,
      icon: config.icon || null,
    });
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setModalConfig(null);
    }, 300);
  };

  // Success toast
  const success = (message, duration = 4000) => {
    return showMessage(message, "success", duration);
  };

  // Error toast
  const error = (message, duration = 5000) => {
    return showMessage(message, "error", duration);
  };

  // Info toast
  const info = (message, duration = 4000) => {
    return showMessage(message, "info", duration);
  };

  // Warning toast
  const warning = (message, duration = 4000) => {
    return showMessage(message, "warning", duration);
  };

  // Loading toast (doesn't auto-close)
  const loading = (message) => {
    return showMessage(message, "loading", 0);
  };

  // Success modal
  const successModal = (title, message, onConfirm) => {
    showModal({
      title,
      message,
      type: "success",
      confirmText: "Great!",
      onConfirm,
    });
  };

  // Error modal
  const errorModal = (title, message, onConfirm) => {
    showModal({
      title,
      message,
      type: "error",
      confirmText: "Got It",
      onConfirm,
    });
  };

  // Info modal
  const infoModal = (title, message, onConfirm) => {
    showModal({
      title,
      message,
      type: "info",
      confirmText: "OK",
      onConfirm,
    });
  };

  // Confirmation modal with cancel
  const confirmModal = (title, message, onConfirm, onCancel) => {
    showModal({
      title,
      message,
      type: "warning",
      confirmText: "Confirm",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm,
      onCancel,
    });
  };

  const clear = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentMessage(null);
    }, 300);
  };

  const value = {
    showMessage,
    success,
    error,
    info,
    warning,
    loading,
    showModal,
    successModal,
    errorModal,
    infoModal,
    confirmModal,
    hideModal,
    clear,
    currentMessage,
    isVisible,
    modalConfig,
    isModalVisible,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
      <ToastDisplay />
      <MessageModal />
    </MessageContext.Provider>
  );
};

// Toast Display Component
const ToastDisplay = () => {
  const { currentMessage, isVisible, hideMessage } = useMessage();

  if (!currentMessage || !isVisible) return null;

  const getIcon = () => {
    switch (currentMessage.type) {
      case "success":
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case "error":
        return <FaTimesCircle className="text-red-500 text-2xl" />;
      case "warning":
        return <FaExclamationCircle className="text-amber-500 text-2xl" />;
      case "loading":
        return <FaSpinner className="text-blue-500 text-2xl animate-spin" />;
      case "info":
      default:
        return <FaInfoCircle className="text-blue-500 text-2xl" />;
    }
  };

  const getBorderColor = () => {
    switch (currentMessage.type) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      case "warning":
        return "border-amber-500";
      case "loading":
        return "border-blue-500";
      case "info":
      default:
        return "border-[#0057FF]";
    }
  };

  const getBgColor = () => {
    switch (currentMessage.type) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-amber-50";
      case "loading":
        return "bg-blue-50";
      case "info":
      default:
        return "bg-blue-50";
    }
  };

  const handleClose = () => {
    hideMessage(currentMessage.id);
  };

  const isPersistent =
    currentMessage.type === "loading" || currentMessage.duration === 0;

  return (
    <div
      className={`
        fixed top-6 right-6 z-[9999] 
        max-w-md w-full 
        bg-white rounded-2xl shadow-2xl 
        border-l-4 ${getBorderColor()}
        transition-all duration-300 transform
        animate-slide-in-right
      `}
      role="alert"
    >
      <div className="flex items-start p-4 gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 break-words">
            {currentMessage.message}
          </p>
        </div>
        {!isPersistent && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close message"
          >
            <FaTimes className="text-lg" />
          </button>
        )}
      </div>

      {!isPersistent && currentMessage.duration > 0 && (
        <div className={`h-1 ${getBgColor()} rounded-b-2xl overflow-hidden`}>
          <div
            className={`h-full ${getBorderColor()} transition-all duration-[${currentMessage.duration}ms] ease-linear`}
            style={{
              width: "100%",
              animation: `shrink ${currentMessage.duration}ms linear forwards`,
            }}
          ></div>
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Modal Component (matches your existing booking error modal style)
const MessageModal = () => {
  const { modalConfig, isModalVisible, hideModal } = useMessage();

  if (!modalConfig || !isModalVisible) return null;

  const getIcon = () => {
    if (modalConfig.icon) return modalConfig.icon;

    switch (modalConfig.type) {
      case "success":
        return <FaCheckCircle className="text-3xl text-green-500" />;
      case "error":
        return <FaTimesCircle className="text-3xl text-red-500" />;
      case "warning":
        return <FaExclamationCircle className="text-3xl text-amber-500" />;
      case "info":
      default:
        return <FaInfoCircle className="text-3xl text-[#0057FF]" />;
    }
  };

  const getIconBg = () => {
    switch (modalConfig.type) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-amber-50";
      case "info":
      default:
        return "bg-blue-50";
    }
  };

  const handleConfirm = () => {
    if (modalConfig.onConfirm) {
      modalConfig.onConfirm();
    }
    hideModal();
  };

  const handleCancel = () => {
    if (modalConfig.onCancel) {
      modalConfig.onCancel();
    }
    hideModal();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center md:items-center"
      onClick={hideModal}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
        onClick={hideModal}
      ></div>

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-t-3xl md:rounded-2xl p-6 mx-4 animate-in slide-in-from-bottom duration-300 md:slide-in-from-bottom-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={hideModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="text-2xl" />
        </button>

        <div
          className={`w-16 h-16 ${getIconBg()} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          {getIcon()}
        </div>

        <h2 className="text-xl font-bold text-center text-[#1A1A1A] mb-3">
          {modalConfig.title}
        </h2>

        <p className="text-gray-600 text-center mb-6">{modalConfig.message}</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            className={`w-full px-5 py-3 rounded-xl font-bold transition-colors ${
              modalConfig.type === "error"
                ? "bg-red-500 text-white hover:bg-red-600"
                : modalConfig.type === "warning"
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-[#0057FF] text-white hover:bg-blue-700"
            }`}
          >
            {modalConfig.confirmText || "OK"}
          </button>

          {modalConfig.showCancel && modalConfig.cancelText && (
            <button
              onClick={handleCancel}
              className="w-full px-5 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {modalConfig.cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom hook for easy access
export const useCustomMessage = () => {
  const {
    success,
    error,
    info,
    warning,
    loading,
    successModal,
    errorModal,
    infoModal,
    confirmModal,
    clear,
  } = useMessage();

  return {
    success,
    error,
    info,
    warning,
    loading,
    successModal,
    errorModal,
    infoModal,
    confirmModal,
    clear,
  };
};

export default MessageProvider;
