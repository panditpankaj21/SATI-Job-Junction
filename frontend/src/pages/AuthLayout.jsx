import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8 transform hover:scale-105 transition-transform duration-300">
          <img 
            src="/SATI/sati-logo.png" 
            alt="logo" 
            className="w-16 h-18 mr-3 drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            SATI Job Junction
          </h1>
        </div>

        {/* Auth Tabs */}
        <div className="flex border-b border-gray-700/50 mb-8">
          <button
            className={`py-4 px-6 font-medium text-sm relative group ${
              activeTab === 'signin' 
                ? 'text-purple-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => {
              setActiveTab('signin');
              setApiError('');
            }}
          >
            Sign In
            {activeTab === 'signin' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-100 transition-transform duration-300"></span>
            )}
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm relative group ${
              activeTab === 'signup' 
                ? 'text-purple-400' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => {
              setActiveTab('signup');
              setApiError('');
            }}
          >
            Sign Up
            {activeTab === 'signup' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-100 transition-transform duration-300"></span>
            )}
          </button>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-900/50 backdrop-blur-sm text-red-200 rounded-lg text-sm border border-red-500/30">
            {apiError}
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-sm bg-gray-800/30 p-8 rounded-xl border border-gray-700/30 shadow-2xl">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-gray-800/50 backdrop-blur-sm text-white w-full pl-10 pr-3 py-3 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-700/50'
                  } focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent transition-all duration-300`}
                  placeholder="student@sati.ac.in"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-gray-800/50 backdrop-blur-sm text-white w-full pl-10 pr-10 py-3 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-700/50'
                  } focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent transition-all duration-300`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500 hover:text-purple-400 transition-colors" />
                  ) : (
                    <FaEye className="text-gray-500 hover:text-purple-400 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800/50 backdrop-blur-sm"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 hover:text-white transition-colors">
                  Remember me
                </label>
              </div>

              <div className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">
                Forgot password?
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
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
          <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-sm bg-gray-800/30 p-8 rounded-xl border border-gray-700/30 shadow-2xl">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`bg-gray-800/50 backdrop-blur-sm text-white w-full pl-10 pr-3 py-3 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-700/50'
                  } focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent transition-all duration-300`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                College Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-gray-800/50 backdrop-blur-sm text-white w-full pl-10 pr-3 py-3 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-700/50'
                  } focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent transition-all duration-300`}
                  placeholder="student@sati.ac.in"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-gray-800/50 backdrop-blur-sm text-white w-full pl-10 pr-10 py-3 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-700/50'
                  } focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent transition-all duration-300`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500 hover:text-purple-400 transition-colors" />
                  ) : (
                    <FaEye className="text-gray-500 hover:text-purple-400 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`bg-gray-800/50 backdrop-blur-sm text-white w-full pl-10 pr-10 py-3 rounded-lg border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700/50'
                  } focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent transition-all duration-300`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-500 hover:text-purple-400 transition-colors" />
                  ) : (
                    <FaEye className="text-gray-500 hover:text-purple-400 transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {activeTab === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button 
                  onClick={() => setActiveTab('signup')} 
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setActiveTab('signin')} 
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;