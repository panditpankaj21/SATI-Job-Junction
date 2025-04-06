import { FaHome, FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GrNotes } from "react-icons/gr";

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }


  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
            <img 
                src="/SATI/sati-logo.png" 
                alt="logo" 
                className="w-14 h-16 mr-2"
            />
          <span className="text-2xl font-bold text-purple-400 ml-1">SATI Job Junction</span>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
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
              href="/"
              className="flex items-center hover:text-purple-400 transition duration-300"
            >
              <GrNotes className="mr-2" />
              Notes & pyqs
            </a>
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
      </div>
    </nav>
  );
};

export default Navbar;