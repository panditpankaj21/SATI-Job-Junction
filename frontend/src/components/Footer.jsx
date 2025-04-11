import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-8 md:py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Quick Links */}
          <div className="text-center md:text-left transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold text-purple-400 mb-4 md:mb-6 hover:text-purple-300 transition-colors">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li className="group">
                <a 
                  href="/" 
                  className="text-gray-300 group-hover:text-purple-400 transition-all duration-300 block py-1 md:py-0 transform group-hover:translate-x-2"
                >
                  Home
                </a>
              </li>
              <li className="group">
                <a 
                  href="/login" 
                  className="text-gray-300 group-hover:text-purple-400 transition-all duration-300 block py-1 md:py-0 transform group-hover:translate-x-2"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="text-center md:text-left transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold text-purple-400 mb-4 md:mb-6 hover:text-purple-300 transition-colors">
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://github.com"
                className="text-gray-300 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                aria-label="GitHub"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-300 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-300 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                aria-label="Twitter"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-left transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold text-purple-400 mb-4 md:mb-6 hover:text-purple-300 transition-colors">
              SATI Job Junction
            </h3>
            <p className="text-gray-300 text-sm">
              &copy; {currentYear} SATI. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-8 md:mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            Made with ❤️ for SATI students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;