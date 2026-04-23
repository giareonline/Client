"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, X } from "lucide-react";

type AlertType = "success" | "error" | "warning";

interface Alert {
  id: string;
  type: AlertType;
  message: string;
}

interface AlertContextType {
  showAlert: (type: AlertType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

const getAlertConfig = (type: AlertType) => {
  switch (type) {
    case "success":
      return {
        icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        closeColor: "text-green-500 hover:bg-green-100",
      };
    case "error":
      return {
        icon: <AlertCircle className="w-6 h-6 text-red-500" />,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        closeColor: "text-red-500 hover:bg-red-100",
      };
    case "warning":
      return {
        icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-800",
        closeColor: "text-yellow-500 hover:bg-yellow-100",
      };
  }
};

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = useCallback((type: AlertType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setAlerts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((msg: string) => showAlert("success", msg), [showAlert]);
  const error = useCallback((msg: string) => showAlert("error", msg), [showAlert]);
  const warning = useCallback((msg: string) => showAlert("warning", msg), [showAlert]);

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const contextValue = React.useMemo(() => ({ showAlert, success, error, warning }), [showAlert, success, error, warning]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {alerts.map((alert) => {
          const config = getAlertConfig(alert.type);
          return (
            <div
              key={alert.id}
              className={`flex items-start p-4 shadow-xl border rounded-xl pointer-events-auto transform transition-all duration-300 animate-in slide-in-from-right-8 fade-in ${config.bgColor} ${config.borderColor}`}
            >
              <div className="flex-shrink-0">{config.icon}</div>
              <div className={`ml-3 w-0 flex-1 pt-0.5 ${config.textColor}`}>
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className={`rounded-md inline-flex p-1 focus:outline-none transition-colors ${config.closeColor}`}
                  onClick={() => removeAlert(alert.id)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AlertContext.Provider>
  );
}
