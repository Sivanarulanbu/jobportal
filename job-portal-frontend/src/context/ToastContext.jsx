import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 animate-slide-in
              ${toast.type === "success" ? "bg-white/90 border-green-200 text-green-800" : ""}
              ${toast.type === "error" ? "bg-white/90 border-red-200 text-red-800" : ""}
              ${toast.type === "info" ? "bg-white/90 border-blue-200 text-blue-800" : ""}
            `}
                    >
                        {toast.type === "success" && <CheckCircle size={20} className="text-green-500" />}
                        {toast.type === "error" && <AlertCircle size={20} className="text-red-500" />}
                        {toast.type === "info" && <Info size={20} className="text-blue-500" />}

                        <p className="text-sm font-medium">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-2 p-1 hover:bg-black/5 rounded-full"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
