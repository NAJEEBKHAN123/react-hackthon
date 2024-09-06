// Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div
      className={`fixed  inset-0 flex items-center bg-black justify-center bg-opacity-50  ${isOpen ? "opacity-100" : "opacity-0"} ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    //   
    > 
      <div
        className={`bg-white p-6 rounded-lg shadow-lg max-w-sm w-full  transition-all duration-300 ${isOpen ? "scale-100" : "scale-0"}`}
      >
        <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
        <p className="mb-4">Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
