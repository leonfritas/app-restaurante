// Modal.jsx

import React from "react";

export default function Modal({ isOpen, onCancel, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6 text-xl font-bold">{children}</div>
        <div className="text-right">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
            onClick={onCancel}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
