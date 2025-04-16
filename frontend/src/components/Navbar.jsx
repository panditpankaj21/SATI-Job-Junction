import { useState } from "react";
import { FaHome, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GrNotes } from "react-icons/gr";
import Notification from "./Notification";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center group">
          <img 
            src="/SATI/sati-logo.png" 
            alt="logo" 
            className="w-10 h-12 md:w-14 md:h-16 mr-2 transform transition-all duration-300 group-hover:scale-110"
          />
          <span className="text-xl md:text-2xl font-bold text-purple-400 ml-1 group-hover:text-purple-300 transition-colors duration-300">
            SATI Job Junction
          </span>
        </div>

        {/* Desktop Navigation Links - hidden on mobile */}
        <ul className="hidden md:flex space-x-8 items-center">
          <li className="group">
            <a
              href="/"
              className="flex items-center text-gray-300 hover:text-purple-400 transition-all duration-300 transform hover:scale-105"
            >
              <FaHome className="mr-2 transform transition-transform duration-300 group-hover:rotate-12" />
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-400 after:transition-all after:duration-300 group-hover:after:w-full">
                Home
              </span>
            </a>
          </li>
          <li className="group">
            <a
              href="https://campus-notes.vercel.app/"
              className="flex items-center text-gray-300 hover:text-purple-400 transition-all duration-300 transform hover:scale-105"
            >
              <GrNotes className="mr-2 transform transition-transform duration-300 group-hover:rotate-12" />
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-400 after:transition-all after:duration-300 group-hover:after:w-full">
                Notes & pyqs
              </span>
            </a>
          </li>
          <li>
            <Notification />
          </li>
          <li className="group">
            <a
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-purple-400 cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <FaSignOutAlt className="mr-2 transform transition-transform duration-300 group-hover:rotate-12" />
              <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-400 after:transition-all after:duration-300 group-hover:after:w-full">
                Logout
              </span>
            </a>
          </li>
        </ul>

        {/* Mobile menu button - visible only on mobile */}
        <div className="md:hidden flex items-center space-x-4">
          <Notification />
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none transform transition-transform duration-300 hover:scale-110"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - appears when hamburger is clicked */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-800 mt-5 to-gray-900 transform transition-all duration-300 ease-in-out">
          <ul className="flex flex-col space-y-4 p-4">
            <li className="group">
              <a
                href="/"
                className="flex items-center text-gray-300 hover:text-purple-400 transition-all duration-300 py-2 transform hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome className="mr-3 transform transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-400 after:transition-all after:duration-300 group-hover:after:w-full">
                  Home
                </span>
              </a>
            </li>
            <li className="group">
              <a
                href="https://campus-notes.vercel.app/"
                className="flex items-center text-gray-300 hover:text-purple-400 transition-all duration-300 py-2 transform hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <GrNotes className="mr-3 transform transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-400 after:transition-all after:duration-300 group-hover:after:w-full">
                  Notes & pyqs
                </span>
              </a>
            </li>
            <li className="group">
              <a
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center text-gray-300 hover:text-purple-400 cursor-pointer transition-all duration-300 py-2 transform hover:translate-x-2"
              >
                <FaSignOutAlt className="mr-3 transform transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-400 after:transition-all after:duration-300 group-hover:after:w-full">
                  Logout
                </span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;