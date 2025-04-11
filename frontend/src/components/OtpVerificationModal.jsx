import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const OtpVerificationModal = ({ email, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer;
    if (isOtpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move to next input when a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split('').forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
    }
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/send-otp`, { email }, {
        headers: {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      });
      setIsOtpSent(true);
      setCountdown(600);
      setMessage("OTP sent successfully!");
      // Focus first input when OTP is sent
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setMessage("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/verify-otp`, {
        email,
        otp: otpCode
      } , {
        headers: {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      });
      setMessage("Verification successful!");
      setTimeout(onClose, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-gray-700/30">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Verify Your Email
        </h2>
        
        {!isOtpSent ? (
          <div className="space-y-6">
            <p className="text-gray-300 text-center">
              We'll send a 6-digit code to <span className="font-semibold text-white">{email}</span> to verify your account.
            </p>
            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-purple-500/20"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-gray-300 text-center">
              Enter the 6-digit code sent to <span className="font-semibold text-white">{email}</span>.
              <br />Expires in: <span className="text-yellow-400 font-medium">{formatTime(countdown)}</span>
            </p>
            
            <div className="flex justify-center space-x-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-2xl text-center bg-gray-800/50 rounded-xl border-2 border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all duration-200"
                  maxLength="1"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            <button
              onClick={handleVerifyOtp}
              disabled={otp.some(d => d === "") || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-purple-500/20"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            
            <button
              onClick={handleSendOtp}
              disabled={countdown > 540 || isLoading}
              className="w-full text-purple-400 hover:text-purple-300 text-sm transition-colors disabled:opacity-50"
            >
              Didn't receive code? Resend
            </button>
          </div>
        )}

        {message && (
          <p className={`mt-6 text-center text-sm font-medium ${
            message.includes("success") 
              ? "text-green-400 bg-green-400/10 py-2 px-4 rounded-lg" 
              : "text-red-400 bg-red-400/10 py-2 px-4 rounded-lg"
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationModal;