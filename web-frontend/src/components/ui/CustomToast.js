// CustomToast.js
import React, { useState } from 'react';

let toastId = 0;
const createToast = (setToasts, type, message) => {
  const id = toastId++;
  setToasts((toasts) => [...toasts, { id, type, message }]);
  setTimeout(() => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, 3000);
};

export const useCustomToast = () => {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => createToast(setToasts, type, message);
  return { toasts, showToast };
};

const Toast = ({ toasts }) => {
  return (
    <div className="fixed top-5 right-5 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded shadow-md ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;