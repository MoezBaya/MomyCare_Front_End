import { useCallback, useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, variant = "success") => {
    const id = `toast-${Date.now()}`;
    setToasts((current) => [{ id, message, variant }, ...current]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  }, []);

  return {
    toasts,
    notify,
    dismissToast,
  };
}
