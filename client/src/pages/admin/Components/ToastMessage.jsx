import { toast } from "react-toastify";

// Toast type configurations
const toastConfig = {
  success: {
    background:
      "linear-gradient(to bottom right, rgba(6, 78, 59, 0.8), rgba(5, 150, 105, 0.4))",
    boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
    iconColor: "#10b981",
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  error: {
    background:
      "linear-gradient(to bottom right, rgba(127, 29, 29, 0.8), rgba(220, 38, 38, 0.4))",
    boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)",
    iconColor: "#ef4444",
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  warning: {
    background:
      "linear-gradient(to bottom right, rgba(146, 64, 14, 0.8), rgba(245, 158, 11, 0.4))",
    boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
    iconColor: "#f59e0b",
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  info: {
    background:
      "linear-gradient(to bottom right, rgba(30, 58, 138, 0.8), rgba(59, 130, 246, 0.4))",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
    iconColor: "#3b82f6",
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  default: {
    background:
      "linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.6))",
    boxShadow: "0 0 20px rgba(34, 211, 238, 0.2)",
    iconColor: "#22d3ee",
    borderColor: "rgba(34, 211, 238, 0.3)",
  },
};

export const glassToast = (message, type = "default", options = {}) => {
  // Normalize type (handle 'warn' alias)
  const normalizedType = type === "warn" ? "warning" : type;

  // Get config for type, fallback to default
  const config = toastConfig[normalizedType] || toastConfig.default;

  // Merge with user options
  const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    ...options,
    style: {
      padding: "16px 20px",
      borderRadius: "12px",
      background: config.background,
      border: `1px solid ${config.borderColor}`,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow: config.boxShadow,
      color: "#fff",
      fontSize: "14px",
      fontWeight: "500",
      ...options.style,
    },
  };

  // Call toast with type
  if (["success", "error", "warning", "info"].includes(normalizedType)) {
    toast[normalizedType](message, toastOptions);
  } else {
    toast(message, toastOptions);
  }
};

// Convenience methods
glassToast.success = (message, options) =>
  glassToast(message, "success", options);
glassToast.error = (message, options) => glassToast(message, "error", options);
glassToast.warning = (message, options) =>
  glassToast(message, "warning", options);
glassToast.info = (message, options) => glassToast(message, "info", options);
