'use client';

import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div id="toast-message" className="toast-message" role="alert" aria-live="polite">
      {message}
    </div>
  );
};
