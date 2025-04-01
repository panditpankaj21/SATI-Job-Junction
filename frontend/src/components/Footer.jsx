import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-purple-400 transition duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-purple-400 transition duration-300">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                className="text-white hover:text-purple-400 transition duration-300"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com"
                className="text-white hover:text-purple-400 transition duration-300"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://twitter.com"
                className="text-white hover:text-purple-400 transition duration-300"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-4">SATI Job Junction</h3>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} SATI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;