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
    <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/SATI/sati-logo.png" 
            alt="logo" 
            className="w-10 h-12 md:w-14 md:h-16 mr-2"
          />
          <span className="text-xl md:text-2xl font-bold text-purple-400 ml-1">
            SATI Job Junction
          </span>
        </div>

        {/* Desktop Navigation Links - hidden on mobile */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <a
              href="/"
              className="flex items-center hover:text-purple-400 transition duration-300"
            >
              <FaHome className="mr-2" />
              Home
            </a>
          </li>
          <li>
            <a
              href="https://campus-notes.vercel.app/"
              className="flex items-center hover:text-purple-400 transition duration-300"
            >
              <GrNotes className="mr-2" />
              Notes & pyqs
            </a>
          </li>
          <li>
            <Notification />
          </li>
          <li>
            <a
              onClick={handleLogout}
              className="flex items-center hover:text-purple-400 cursor-pointer transition duration-300"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </a>
          </li>
        </ul>

        {/* Mobile menu button - visible only on mobile */}
        <div className="md:hidden flex items-center space-x-4">
          <Notification />
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
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
        <div className="md:hidden bg-gray-800">
          <ul className="flex flex-col space-y-4 p-4">
            <li>
              <a
                href="/"
                className="flex items-center hover:text-purple-400 transition duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaHome className="mr-3" />
                Home
              </a>
            </li>
            <li>
                <a
                  href="https://campus-notes.vercel.app/"
                  className="flex items-center hover:text-purple-400 transition duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <GrNotes className="mr-3" />
                  Notes & pyqs
                </a>
            </li>
            <li>
              <a
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center hover:text-purple-400 cursor-pointer transition duration-300 py-2"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;