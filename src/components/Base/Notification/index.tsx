import { useEffect, useState } from "react";
import clsx from "clsx";

interface NotificationProps {
  show: boolean;
  type?: "success" | "error" | "warning" | "info";
  message: string;
  onClose: () => void;
  duration?: number;
}

function Notification({
  show,
  type = "info",
  message,
  onClose,
  duration = 3000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {    
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onClose, type, message]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={clsx([
        "fixed top-4 right-4 z-[9999]",
        "transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full",
      ])}
    >
      <div
        className={clsx([
          "flex items-center justify-between",
          "px-6 py-4 rounded-lg shadow-lg",
          "min-w-[300px] max-w-[400px]",
          "border-l-4",
          {
            "bg-white text-slate-800": true,
            "border-theme-1": type === "success",
            "border-danger": type === "error",
            "border-warning": type === "warning",
            "border-info": type === "info",
          },
        ])}
      >
        <div className="flex items-center space-x-3">
          {type === "success" && (
            <div className="text-theme-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          )}
          {type === "error" && (
            <div className="text-danger">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="ml-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Notification;
