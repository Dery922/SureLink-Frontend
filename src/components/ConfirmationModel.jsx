// src/components/ConfirmationModal.jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger", // danger, warning, info
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              type === "danger"
                ? "bg-red-100"
                : type === "warning"
                  ? "bg-yellow-100"
                  : "bg-blue-100"
            }`}
          >
            <i
              className={`fa-solid ${
                type === "danger"
                  ? "fa-exclamation-triangle text-red-500"
                  : type === "warning"
                    ? "fa-exclamation-circle text-yellow-500"
                    : "fa-info-circle text-blue-500"
              } text-2xl`}
            ></i>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-center text-[#1A1A1A] mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-center text-sm mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-medium hover:scale-105"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white transition-all duration-300 text-sm font-medium hover:scale-105 ${
              type === "danger"
                ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25"
                : type === "warning"
                  ? "bg-yellow-500 hover:bg-yellow-600 shadow-lg shadow-yellow-500/25"
                  : "bg-[#0057FF] hover:bg-blue-700 shadow-lg shadow-[#0057FF]/25"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmationModal;
