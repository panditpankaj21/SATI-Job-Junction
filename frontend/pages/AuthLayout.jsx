import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUniversity, FaSpinner } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthLayout = ({ isSignUp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(isSignUp ? 'signup' : 'signin');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear errors when user types
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (activeTab === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setApiError('');

    try {
      if (activeTab === 'signup') {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
      } else {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/login`, {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
      }
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
      setApiError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - College Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-900 to-indigo-900 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/SATI/sati-logo.png" 
              alt="logo" 
              className="w-14 h-16 mr-2"
            />
            <h1 className="text-4xl font-bold text-white">SATI Job Junction</h1>
          </div>
          
          <div className="backdrop-blur-md rounded-xl p-6 border border-white border-opacity-20">
            <h2 className="text-2xl font-semibold text-white mb-4">Why Join Us?</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <MdVerified className="text-purple-400 mt-1 mr-2 flex-shrink-0" />
                <span>Connect with alumni and industry professionals</span>
              </li>
              <li className="flex items-start">
                <MdVerified className="text-purple-400 mt-1 mr-2 flex-shrink-0" />
                <span>Get access to exclusive job postings</span>
              </li>
              <li className="flex items-start">
                <MdVerified className="text-purple-400 mt-1 mr-2 flex-shrink-0" />
                <span>Share interview experiences and tips</span>
              </li>
              <li className="flex items-start">
                <MdVerified className="text-purple-400 mt-1 mr-2 flex-shrink-0" />
                <span>Build your professional network</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-300 italic">"Empowering students with career opportunities since 1960"</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img 
              src="/SATI/sati-logo.png" 
              alt="logo" 
              className="w-12 h-14 mr-2"
            />
            <h1 className="text-3xl font-bold text-white">SATI Job Junction</h1>
          </div>

          {/* Auth Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`py-3 px-6 font-medium text-sm ${activeTab === 'signin' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('signin');
                setApiError('');
              }}
            >
              Sign In
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm ${activeTab === 'signup' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
              onClick={() => {
                setActiveTab('signup');
                setApiError('');
              }}
            >
              Sign Up
            </button>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-50 text-red-200 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`bg-gray-800 text-white w-full pl-10 pr-3 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="student@sati.ac.in"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`bg-gray-800 text-white w-full pl-10 pr-10 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500 hover:text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-500 hover:text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <div className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer">
                  Forgot password?
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`bg-gray-800 text-white w-full pl-10 pr-3 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  College Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`bg-gray-800 text-white w-full pl-10 pr-3 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="student@sati.ac.in"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`bg-gray-800 text-white w-full pl-10 pr-10 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500 hover:text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-500 hover:text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`bg-gray-800 text-white w-full pl-10 pr-10 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-500 hover:text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-500 hover:text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {activeTab === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setActiveTab('signup')} 
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setActiveTab('signin')} 
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;