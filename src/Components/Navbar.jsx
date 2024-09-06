// Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Adjust the path as necessary

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogOut = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
    setIsModalOpen(false); // Close modal after logging out
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className=" shadow-sm p-4 bg-blue-200">
      <div className="container mx-auto  flex justify-between items-center">
        <div className="text-gray-800 text-xl font-bold">
          <Link to="/">Countdown Board </Link>
        </div>
        <ul className="flex space-x-4 items-center text-gray-800">
          <li>
            <Link to="/" className="hover:text-blue-500 font-semibold">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-500 font-semibold">
              About
            </Link>
          </li>

          {user ? (
            <li
              onClick={handleLogOut}
              className="cursor-pointer bg-red-500 hover:bg-red-600 rounded-sm text-white px-4 py-1 hover:text-blue-500n font-semibold"
            >
              Logout
            </li>
          ) : (
            <Link to="/signin" className="hover:text-blue-500 font-semibold">
              Sign In
            </Link>
          )}
        </ul>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
      />
    </nav>
  );
};

export default Navbar;
