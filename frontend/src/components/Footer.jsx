import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 md:py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-purple-400 mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/" 
                  className="hover:text-purple-400 transition duration-300 block py-1 md:py-0"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/login" 
                  className="hover:text-purple-400 transition duration-300 block py-1 md:py-0"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-purple-400 mb-3 md:mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://github.com"
                className="text-white hover:text-purple-400 transition duration-300"
                aria-label="GitHub"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-white hover:text-purple-400 transition duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                className="text-white hover:text-purple-400 transition duration-300"
                aria-label="Twitter"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-purple-400 mb-3 md:mb-4">SATI Job Junction</h3>
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