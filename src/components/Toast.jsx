import { useEffect } from "react";

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow z-50 transition">
      {message}
      <button className="ml-3 text-white font-bold" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
